import pke
import string
import os
import nltk
from nltk.corpus import stopwords
from flashtext import KeywordProcessor
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.wsd import lesk
from collections import OrderedDict
#from nltk.corpus import wordnet as wn
import requests
from gensim.models import KeyedVectors

nltk.download('stopwords')
nltk.download('popular')
nltk.download('cess_esp')
nltk.download('conll2002')

#Con esto obtengo las rutas relativas , es equivalente a  ../../
dir_path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
dirnameWE =os.path.join(dir_path,'ModelosIA/QG/glove-sbwc.i25.vec') #os.path.realpath('/var/www/webApp/webApp/Backend/src/ModelosIA/QG/glove-sbwc.i25.vec')
dirnameWN= os.path.join(dir_path,'wordnet') #os.path.realpath('/var/www/webApp/webApp/Backend/src/wordnet') #'src/wordnet')
#EL PARAMETRO LIMIT ES PARA REDUCIR LOS TIEMPOS DE CARGA TODO

#wordEmbedding=wordEmbedding.init_sims(replace=True)

def get_word_embedding():
    return KeyedVectors.load_word2vec_format(dirnameWE, binary=False, limit=5000) #.init_sims(replace=True)
    
def get_nouns_multipartite(text):
    out=[]
    #print("TEXTO DE ENTRADA")
    #print(text)
    extractor = pke.unsupervised.MultipartiteRank()
    
    stoplist = list(string.punctuation)
    stoplist += ['-lrb-', '-rrb-', '-lcb-', '-rcb-', '-lsb-', '-rsb-']
    stoplist += stopwords.words('spanish')

    extractor.load_document(input=text, language='es', stoplist=stoplist)
    #    not contain punctuation marks or stopwords as candidates.
    #pos = {'VERB'}
    pos = {'PROPN','NOUN','ADJ','VERB'} #
    #pos = {'VERB', 'ADJ', 'NOUN'}
    
    extractor.candidate_selection(pos=pos)
    # 4. build the Multipartite graph and rank candidates using random walk,
    #    alpha controls the weight adjustment mechanism, see TopicRank for
    #    threshold/method parameters.
    extractor.candidate_weighting(#alpha=1.1,
                                  threshold=0.75,
                                  method='average')
    keyphrases = extractor.get_n_best(n=10, stemming=False)
    #print("SALIDAAAAAAAAAA")
    #print(keyphrases)
    for key in keyphrases:
        out.append(key[0])

    return out
 ################################################################# END Keyword Extraction #######################################


def tokenize_sentences(text):
    sentences = [sent_tokenize(text)]
    sentences = [y for x in sentences for y in x]
    # Remove any short sentences less than 20 letters.
    sentences = [sentence.strip() for sentence in sentences if len(sentence) > 20]
    return sentences

def get_sentences_for_keyword(keywords, sentences):
    keyword_processor = KeywordProcessor()
    keyword_sentences = {}
    for word in keywords:
        keyword_sentences[word] = []
        keyword_processor.add_keyword(word)
    for sentence in sentences:
        keywords_found = keyword_processor.extract_keywords(sentence)
        for key in keywords_found:
            keyword_sentences[key].append(sentence)

    for key in keyword_sentences.keys():
        values = keyword_sentences[key]
        values = sorted(values, key=len, reverse=True)
        keyword_sentences[key] = values

    #Eliminando de las opciones a "Capitulo y Capítulo ya que no aportan"
    keyword_sentences.pop('capítulo', None)
    keyword_sentences.pop('Capítulo', None)
    keyword_sentences.pop('capitulo', None)
    keyword_sentences.pop('Capitulo', None)
    return keyword_sentences

def limpieza_sentences_Word (keywords, sentences):
    #Eliminando palabras que son iguales a las oraciones
    if( len(keywords)==1 and  len(sentences)>0 and (len(sentences[0])-len(keywords[0]))<=3 ):
        return [],[]
    else:
        #Eliminando de las opciones a "Capitulo y Capítulo ya que no aportan"
        if 'capítulo' in keywords: keywords.remove('capítulo')
        if 'Capítulo' in keywords: keywords.remove('Capítulo')
        if 'capitulo' in keywords: keywords.remove('capitulo')
        if 'Capitulo' in keywords: keywords.remove('Capitulo')
       
        return keywords, sentences
 
################################################################## BEGIN Sentence Mapping  #######################################

################################################################## END Sentence Mapping  #######################################
####################################################### BEGIN Generate MCQ ############################################################
from googletrans import Translator
def translateDistractors(lista): 
  # init the Google API translator
  if(lista):
    translator= Translator()
    translation = translator.translate(" | ".join(lista), src='en', dest='es')
    #print(f"{translation.origin} ({translation.src}) --> {translation.text} ({translation.dest})")
    word = translation.text
    return word.split(" | ")
  return []

  

# Distractors from Wordnet
def get_distractors_wordnet(syn,keyword):
    
    distractors_list=[]
    keyword= keyword.lower()
    orig_keyword = keyword
    if len(keyword.split())>0:
        keyword = keyword.replace(" ","_")
    hypernym = syn.hypernyms()
    if len(hypernym) == 0: 
        return distractors_list
    for item in hypernym[0].hyponyms():
        name = item.lemmas()[0].name()
        if name == orig_keyword:
            continue
        name = name.replace("_"," ")
        name = " ".join(w.capitalize() for w in name.split())
        if name is not None and name not in distractors_list:
            if('`' not in name):
                distractors_list.append(name)
    distractors_list = list(OrderedDict.fromkeys(distractors_list))  # Elimino los repetidos

    return distractors_list

def get_wordsense(sent,word):
    wn = nltk.corpus.reader.wordnet.WordNetCorpusReader(dirnameWN, None)

    word= word.lower()
    
    if len(word.split())>0:
        word = word.replace(" ","_")
    
    synsets = wn.synsets(word,'n')

    if synsets:
      return lesk(word_tokenize(sent, language='spanish'), word, synsets=synsets)
    else:
        return []

# Distractors from http://conceptnet.io/

def get_distractors_conceptnet(word):
    
    word = word.lower()
    original_word= word
    if (len(word.split())>0):
        word = word.replace(" ","_")
    distractor_list = [] 
    url = "http://api.conceptnet.io/query?node=/c/en/%s/n&rel=/r/PartOf&start=/c/en/%s&limit=5"%(word,word)
    obj = requests.get(url).json()

    for edge in obj['edges']:
        link = edge['end']['term'] 

        url2 = "http://api.conceptnet.io/query?node=%s&rel=/r/PartOf&end=%s&limit=10"%(link,link)
        obj2 = requests.get(url2).json()
        for edge in obj2['edges']:
            word2 = edge['start']['label']
            if word2 not in distractor_list and original_word.lower() not in word2.lower():
                distractor_list.append(word2)

    distractor_list = list(OrderedDict.fromkeys(distractor_list))  # Elimino los repetidos   
    distractor_list=translateDistractors(distractor_list)
    return distractor_list


def get_distractors_wordEmbedding(word, cantidad, wordEmbedding):
    
    word = word.lower()
    word = word.replace(" ","_")
    #original_word= word
    # load the Stanford GloVe model
    salida=[]
    try:
        distractor_list=wordEmbedding.most_similar(word, topn=10)
        for item in list(distractor_list):
            if item[0]==word:
                distractor_list.remove(word, item[1])
            if item[0]==word+"s":
                distractor_list.remove((word+"s",item[1]))
        # Elimino los repetidos
        distractor_list = list(OrderedDict.fromkeys(distractor_list))  
        for element in list(distractor_list[:cantidad]):
            salida.append(element[0].capitalize())
        return salida
    except KeyError:
        return []
    


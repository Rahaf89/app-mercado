
 #1 estrella peor calificacion, 5 estrellas mejor calificacion
from transformers import pipeline

classifier = pipeline('sentiment-analysis', model="nlptown/bert-base-multilingual-uncased-sentiment")

def analisisSentimientos(sentence):
   
    result = classifier(sentence)
    return result
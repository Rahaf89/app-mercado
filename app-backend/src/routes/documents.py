from flask import Blueprint, Flask, request, jsonify, Response
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import json_util
from bson.objectid import ObjectId
from pathlib import Path
import aspose.words as aw
import time
import flask
import os
import requests

try:
    from win32com import client
    import pythoncom
except ImportError:
    client = None
    pythoncom = None

documents = Blueprint('documents', __name__)

appDoc = Flask(__name__) 
appDoc.config['UPLOAD_FOLDER'] =  os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))),"files")
appDoc.config["MONGO_URI"] = "mongodb://localhost:27017/DBMercado"
CORS(appDoc)

mongodb_client = PyMongo(appDoc)
db = mongodb_client.db

#############
#   Peticion POST
#   Enviamos un archivo PDF, el mismo sera guardado en el sistema y ademas se guardaran los datos
#   de la evaluacion.
###########
@documents.route('/documents/<tipo>', methods=['POST'])
def set_documents(tipo):
    if not request.files:
        
        data = {'message' : 'Sent failed!'}
        return jsonify(isError= True, message= "Error", statusCode= 400, data = data), 400

    else:
        # obtenemos el archivo del input "archivo"
        f = request.files['archivo']

        filename = time.strftime("%Y%m%d%H%M%S") + '-' + tipo + '.pdf'
        
        # Guardamos el archivo en el directorio "Archivos PDF"
        f.save(os.path.join(appDoc.config['UPLOAD_FOLDER'],  tipo, filename))

        documents = {
                    "nombre": filename,
                    "formato": request.files['archivo'].content_type,
                    "tipo" : tipo
                    }

        result = db.documents.insert_one(documents)

        # Retornamos una respuesta satisfactoria
        data = {'message' : 'Sent Successfull', 'name' : filename, 'id' : str(result.inserted_id)}

        return jsonify(isError= False, message= "Success", statusCode= 200, data = data), 200

#############
#   Peticion POST
#   Se verifica una URL de un archivo fisico para guardar archivos PDF o Word
###########
@documents.route('/DownloadFile/<tipo>', methods = ['POST']) 
def DownloadFile(tipo): 

    nombre = time.strftime("%Y%m%d%H%M%S") + '-' + tipo + '.pdf'

    filename = Path(os.path.join(appDoc.config['UPLOAD_FOLDER'], tipo,nombre))
    url = request.json.get('url')
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.76 Safari/537.36'}
    response = requests.get(url, headers=headers)
    print(response)
    if response.status_code == 200:
        filename.write_bytes(response.content)

        documents = {"nombre": nombre, "formato": "application/pdf", "tipo" : tipo}
        result = db.documents.insert_one(documents)

        # Retornamos una respuesta satisfactoria
        data = {'message' : 'Sent Successfull', 'name' : nombre, 'id' : str(result.inserted_id)}

        return flask.jsonify(message="success", data=data)
    else:
        return flask.jsonify(message="error", statusCode=response.status_code)

#############
#   Peticion POST
#   Enviamos un archivo WORD, el mismo sera guardado en el sistema y ademas se guardaran los datos
#   de la evaluacion.
###########
# @documents.route('/documents/word/<tipo>', methods=['POST'])
# def set_documents_word(tipo):
#     if not request.files:
        
#         data = {'message' : 'Sent failed!'}
#         return jsonify(isError= True, message= "Error", statusCode= 400, data = data), 400

#     else:
#         # obtenemos el archivo del input "archivo"
#         f = request.files['archivo']

#         print(f.filename)

#         extension = '.doc'
#         if f.filename.find(".docx") != -1:
#             extension = '.docx'

#         filename = time.strftime("%Y%m%d%H%M%S") + '-' + tipo
        
#         # Guardamos el archivo en el directorio "Archivos PDF"
#         f.save(os.path.join(appDoc.config['UPLOAD_FOLDER'] + tipo, filename + extension))

#         wdFormatPDF = 17

#         print(appDoc.config['UPLOAD_FOLDER'] + tipo + "/" + filename)

#         inputFile = os.path.abspath(appDoc.config['UPLOAD_FOLDER'] + tipo + "/" + filename + extension)
#         outputFile = os.path.abspath(appDoc.config['UPLOAD_FOLDER'] + tipo + "/" + filename + '.pdf')
#         word = client.Dispatch('Word.Application', pythoncom.CoInitialize())
#         doc = word.Documents.Open(inputFile)
#         doc.SaveAs(outputFile, FileFormat=wdFormatPDF)
#         doc.Close()
#         word.Quit()

#         documents = {
#                     "nombre": filename + '.pdf',
#                     "formato": request.files['archivo'].content_type,
#                     "tipo" : tipo
#                     }

#         result = db.documents.insert_one(documents)

#         # Retornamos una respuesta satisfactoria
#         data = {'message' : 'Sent Successfull', 'name' : filename + '.pdf', 'id' : str(result.inserted_id)}

#         return jsonify(isError= False, message= "Success", statusCode= 200, data = data), 200

#############
#   Peticion POST
#   Enviamos un archivo WORD, el mismo sera guardado en el sistema y ademas se guardaran los datos
#   de la evaluacion.
###########
@documents.route('/documents/word/<tipo>', methods=['POST'])
def set_documents_word(tipo):
    if not request.files:
        
        data = {'message' : 'Sent failed!'}
        return jsonify(isError= True, message= "Error", statusCode= 400, data = data), 400

    else:
        # obtenemos el archivo del input "archivo"
        f = request.files['archivo']

        extension = '.doc'
        if f.filename.find(".docx") != -1:
            extension = '.docx'

        filename = time.strftime("%Y%m%d%H%M%S") + '-' + tipo

        # Guardamos el archivo en el directorio
        f.save(os.path.join(appDoc.config['UPLOAD_FOLDER'],tipo, filename + extension))

        ## Obtengo la ruta del archivo
        doc = os.path.abspath(os.path.join(appDoc.config['UPLOAD_FOLDER'], tipo, filename + extension))

        # if client is None:
        doc2pdf_linux(doc,tipo,filename)
        # else:
        #     try:
        #         outputFile = os.path.abspath(os.path.join(appDoc.config['UPLOAD_FOLDER'], tipo, filename+ '.pdf'))
        #         word = client.Dispatch('Word.Application', pythoncom.CoInitialize())
        #         worddoc = word.Documents.Open(doc)
        #         worddoc.SaveAs(outputFile, FileFormat=17)
        #     except Exception:
        #         raise
        #     finally:
        #         worddoc.Close()
        #         word.Quit()

        documents = {
                    "nombre": filename + '.pdf',
                    "formato": request.files['archivo'].content_type,
                    "tipo" : tipo
                    }

        print("DOCUMENTOOOOOOOOOO")
        print(documents)
        result = db.documents.insert_one(documents)

        # Retornamos una respuesta satisfactoria
        data = {'message' : 'Sent Successfull', 'name' : filename + '.pdf', 'id' : str(result.inserted_id)}

        return jsonify(isError= False, message= "Success", statusCode= 200, data = data), 200

# def doc2pdf_linux(doc,tipo):
#     """
#     convert a doc/docx document to pdf format (linux only, requires libreoffice)
#     :param doc: path to document
#     """
#     salida=os.path.abspath(os.path.join(appDoc.config['UPLOAD_FOLDER'], tipo))
#     print(salida)
#     cmd ='export HOME=/var/www/webApp/webApp/Backend/src/files/guides && /usr/bin/soffice --headless --invisible --convert-to pdf /var/www/webApp/webApp/Backend/src/files/guides/formato-guias-new.doc --outdir /var/www/webApp/webApp/Backend/src/files/guides'#.split()#/webApp/Backend/src/files/guides && /usr/bin/soffice --headless --invisible --convert-to pdf /var/www/webApp/webApp/Backend/src/files/guides/formato-guias-new.doc --outdir /var/www/webApp/webApp/Backend/src/files/guides'.split() #'export HOME=/var/www/webApp/webApp/Backend/src/files/guides && /usr/bin/soffice --headless --invisible --convert-to pdf'.split()+ [doc]  +['--outdir']+  [salida] #'libreoffice --headless --convert-to pdf:writer_pdf_Export --outdir /var/www/webApp/webApp/Backend/src/files/guides/ /var/www/webApp/webApp/Backend/src/files/guides/formato-guias-new.doc' #'soffice --headless --convert-to pdf --outdir /var/www/webApp/webApp/Backend/src/files/guides/ /var/www/webApp/webApp/Backend/src/files/guides/formato-guias-new.doc' #'libreoffice --headless --invisible --convert-to pdf'.split() + [doc]  +['--outdir']+  [salida]
#     p = subprocess.Popen(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE, shell=True)
#     p.wait(timeout=50)
#     stdout, stderr = p.communicate()
#     if stderr:
#         raise subprocess.SubprocessError(stderr)
#     if stdout:
#         raise subprocess.SubprocessError(stdout)


def doc2pdf_linux(doc, tipo, filename):
    outputFile = os.path.abspath(os.path.join(appDoc.config['UPLOAD_FOLDER'], tipo, filename+ '.pdf'))

    # For complete examples and data files, please go to https://github.com/aspose-words/Aspose.Words-for-Python-via-.NET
    # docA = aw.Document(doc)

    # outStream = io.BytesIO()
    # docA.save(outStream, aw.SaveFormat.DOCX)

    # docBytes = outStream.getbuffer()
    # inStream = io.BytesIO(docBytes)

    #loadOptions = aw.loading.LoadOptions()
    #loadOptions.language_preferences.default_editing_language = aw.loading.EditingLanguage.RUSSIAN

    # Load word document
    doc = aw.Document(doc)

    # Create save options and set compliance
    saveOptions = aw.saving.PdfSaveOptions()
    saveOptions.compliance = aw.saving.PdfCompliance.PDF17 

    # Save as PDF
    doc.save(outputFile, saveOptions)

#############
#   Peticion GET
#   Leemos los archivos exitentes en el sistema para una materia y los plasmamos en el formulario
#   de la evaluacion.
###########

@documents.route("/documents", methods=['GET'])
def get_documents():
    documents = db.documents.find()
    response = json_util.dumps(documents)
    return Response(response, mimetype="application/json")

@documents.route("/documents/<tipo>", methods=['GET'])
def get_documents_by_type(tipo):

    data = {
        "tipo" : tipo
    }

    documents = db.documents.find(data)
    response = json_util.dumps(documents)
    return Response(response, mimetype="application/json")

@documents.route('/documents/<id>', methods=['DELETE'])
def delete_documents(id):

    data = {
        "_id" : ObjectId(id)
    }

    documents = db.documents.find_one(data)
    nombre = documents['nombre']

    try:
        os.unlink(os.path.join(appDoc.config['UPLOAD_FOLDER'], documents['tipo'], nombre[:len(nombre)-4]+'.docx'))
    except:
        print("Archivo DOCX no existe")

    try:
        os.unlink(os.path.join(appDoc.config['UPLOAD_FOLDER'], documents['tipo'], nombre[:len(nombre)-4]+'.doc'))
    except:
        print("Archivo DOC no existe")

    try:
        os.unlink(os.path.join(appDoc.config['UPLOAD_FOLDER'], documents['tipo'], nombre))
    except:
        print("Archivo PDF no existe")

    db.documents.delete_one({'_id': ObjectId(id)})
    response = jsonify({'message': 'Documento ' + id + ' ha sido eliminado.'})
    response.status_code = 200
    return response
from flask import Blueprint, Flask, request, jsonify, Response
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import json_util
from bson.objectid import ObjectId
import flask
import sys,os
sys.path.append(os.path.dirname((os.path.dirname(os.path.realpath(__file__)))))
from src.analisisSentimientosAPI import analisisSentimientos
comment = Blueprint('comment', __name__)

appCom = Flask(__name__) 
appCom.config['UPLOAD_FOLDER'] = 'src/files/'
appCom.config["MONGO_URI"] = "mongodb://localhost:27017/DBMercado"
CORS(appCom)

mongodb_client = PyMongo(appCom)
db = mongodb_client.db

@comment.route('/comment', methods=['POST'])
def set_comment():
    puntaje=analisisSentimientos(request.json.get('descripcion'))
    comment = {"descripcion": request.json.get('descripcion'),
                  "idUser": request.json.get('idUser'),
                  "idProduct": request.json.get('idProduct'),
                  "time": request.json.get('time'),
                  "puntaje_valor" : puntaje[0]['label'],
                  "puntaje_porcentaje" : puntaje[0]['score']*100,
                }

    result = db.comment.insert_one(comment)
    return flask.jsonify(message="success", id=str(result.inserted_id)), 200

@comment.route("/comment", methods=['GET'])
def get_comments():
    comment = db.comment.find()
    response = json_util.dumps(comment)
    return Response(response, mimetype="application/json")

@comment.route("/comment/<idUser>/user", methods=['GET'])
def get_comments_user(idUser):
    comment = db.comment.find({'idUser' : idUser})
    response = json_util.dumps(comment)
    return Response(response, mimetype="application/json")

@comment.route("/comment/<idProduct>/product", methods=['GET'])
def get_comments_by_product(idProduct):
    comment = db.comment.find({'idProduct' : idProduct})
    response = json_util.dumps(comment)
    return Response(response, mimetype="application/json")

@comment.route("/comment/<idProduct>/relationship/<idUser>", methods=['GET'])
def get_comments_by_user_product(idProduct, idUser):
    comment = db.comment.find({'idProduct' : idProduct, "idUser" : idUser})
    response = json_util.dumps(comment)
    return Response(response, mimetype="application/json")

@comment.route('/comment/<id>', methods=['GET'])
def get_comment(id):
    comment = db.comment.find_one({'_id': ObjectId(id) })
    response = json_util.dumps(comment)
    return Response(response, mimetype="application/json")

@comment.route('/comment/<id>', methods=['DELETE'])
def delete_comment(id):

    data = {"_id" : ObjectId(id)}

    db.comment.delete_one(data)

    response = jsonify({'message': 'comment ' + id + ' ha sido eliminado.'})
    response.status_code = 200
    return response

@comment.route('/comment/<_id>', methods=['PUT'])
def update_comment(_id):
    
    descripcion = request.json.get('descripcion')
    idUser = request.json.get('idUser')
    idProduct = request.json.get('idProduct')
    time = request.json.get('time')
    puntaje = request.json.get('puntaje')

    array_id = {
        "_id" : ObjectId(_id)
    }

    data = {
        '$set': {
            "descripcion": descripcion,
            "idUser": idUser,
            "idProduct": idProduct,
            "time" : time,
            "puntaje" : puntaje
        }
    }
    
    db.comment.update_one(array_id, data)
    response = jsonify({'message': 'comment ' + _id + ' Updated Successfuly'})
    response.status_code = 200
    return response
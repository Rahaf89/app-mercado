from flask import Blueprint, Flask, request, jsonify, Response
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import json_util
from bson.objectid import ObjectId
from spellchecker import SpellChecker
import os
import flask

category = Blueprint('category', __name__)

appCAT = Flask(__name__) 
appCAT.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))),"files")
appCAT.config["MONGO_URI"] = "mongodb://localhost:27017/DBMercado"
CORS(appCAT)

mongodb_client = PyMongo(appCAT)
db = mongodb_client.db

@category.route('/category', methods=['POST'])
def set_category():
    category = {"nombre": request.json.get('nombre'),
                "tipo": request.json.get('tipo'),
                "descripcion" : request.json.get('descripcion')}

    result = db.category.insert_one(category)
    return flask.jsonify(message="success", id=str(result.inserted_id)), 200

@category.route("/category", methods=['GET'])
def get_categorys():
    category = db.category.find()
    response = json_util.dumps(category)
    return Response(response, mimetype="application/json")

@category.route('/category/<id>', methods=['GET'])
def get_category(id):
    category = db.category.find_one({'_id': ObjectId(id) })
    response = json_util.dumps(category)
    return Response(response, mimetype="application/json")

@category.route('/category/<id>', methods=['DELETE'])
def delete_category(id):

    data = {"_id" : ObjectId(id)}

    db.category.delete_one(data)

    response = jsonify({'message': 'Category ' + id + ' ha sido eliminado.'})
    response.status_code = 200
    return response

@category.route('/category/<_id>', methods=['PUT'])
def update_category(_id):

    nombre = request.json.get('nombre')
    tipo = request.json.get('tipo')
    descripcion = request.json.get('descripcion')

    array_id = {
        "_id" : ObjectId(_id)
    }

    data = {
        '$set': {
            "nombre": nombre,
            "tipo": tipo,
            "descripcion": descripcion
        }
    }
    
    db.category.update_one(array_id, data)
    response = jsonify({'message': 'Category ' + _id + ' Updated Successfuly'})
    response.status_code = 200
    return response
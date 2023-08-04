from flask import Blueprint, Flask, request, jsonify, Response
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import json_util
from bson.objectid import ObjectId
import flask

payment = Blueprint('payment', __name__)

appPay = Flask(__name__) 
appPay.config['UPLOAD_FOLDER'] = 'src/files/'
appPay.config["MONGO_URI"] = "mongodb://localhost:27017/DBMercado"
CORS(appPay)

mongodb_client = PyMongo(appPay)
db = mongodb_client.db

@payment.route('/payment', methods=['POST'])
def set_payment():
    payment = { "nombre": request.json.get('nombre'),
                  "identificacion": request.json.get('identificacion'),
                  "telefono": request.json.get('telefono'),
                  "numero_cuenta" : request.json.get('numero_cuenta'),
                  "nombre_cuenta" : request.json.get('nombre_cuenta'),
                  "tipo" : request.json.get('tipo'),
                  "idUser": request.json.get('idUser'),
                  "descripcion": request.json.get('descripcion')
                }

    result = db.payment.insert_one(payment)
    return flask.jsonify(message="success", id=str(result.inserted_id)), 200

@payment.route("/payment", methods=['GET'])
def get_payments():
    payment = db.payment.find()
    response = json_util.dumps(payment)
    return Response(response, mimetype="application/json")

@payment.route("/payment/<idUser>/user", methods=['GET'])
def get_payments_user(idUser):
    payment = db.payment.find({'idUser' : idUser})
    response = json_util.dumps(payment)
    return Response(response, mimetype="application/json")

@payment.route('/payment/<id>', methods=['GET'])
def get_payment(id):
    payment = db.payment.find_one({'_id': ObjectId(id) })
    response = json_util.dumps(payment)
    return Response(response, mimetype="application/json")

@payment.route('/payment/<id>', methods=['DELETE'])
def delete_payment(id):

    data = {"_id" : ObjectId(id)}

    db.payment.delete_one(data)

    response = jsonify({'message': 'payment ' + id + ' ha sido eliminado.'})
    response.status_code = 200
    return response

@payment.route('/payment/<_id>', methods=['PUT'])
def update_payment(_id):
    nombre = request.json.get('nombre')
    idUser = request.json.get('idUser')
    identificacion = request.json.get('identificacion')
    telefono = request.json.get('telefono')
    numero_cuenta = request.json.get('numero_cuenta')
    nombre_cuenta = request.json.get('nombre_cuenta')
    tipo = request.json.get('tipo')
    descripcion = request.json.get('descripcion')

    array_id = {
        "_id" : ObjectId(_id)
    }

    data = {
        '$set': {
            "nombre": nombre,
            "idUser": idUser,
            "identificacion": identificacion,
            "telefono" : telefono,
            "numero_cuenta" : numero_cuenta,
            "nombre_cuenta" : nombre_cuenta,
            "tipo" : tipo,
            "descripcion" : descripcion
        }
    }
    
    db.payment.update_one(array_id, data)
    response = jsonify({'message': 'payment ' + _id + ' Updated Successfuly'})
    response.status_code = 200
    return response
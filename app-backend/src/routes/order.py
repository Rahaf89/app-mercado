from flask import Blueprint, Flask, request, jsonify, Response
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import json_util
from bson.objectid import ObjectId
import flask
import sys,os, json
order = Blueprint('order', __name__)

appOrd = Flask(__name__) 
appOrd.config['UPLOAD_FOLDER'] = 'src/files/'
appOrd.config["MONGO_URI"] = "mongodb://localhost:27017/DBMercado"
CORS(appOrd)

sys.path.append(os.path.dirname((os.path.dirname(os.path.realpath(__file__)))))
from src.grafosAPI import addNode, addRelation, distanceCalculate

mongodb_client = PyMongo(appOrd)
db = mongodb_client.db

@order.route('/order', methods=['POST'])
def set_order():
    order = { 
            "idPayment": request.json.get('idPayment'),
            "idUser": request.json.get('idUser'),
            "idProduct" : request.json.get('idProduct'),
            "comprobante" : request.json.get('comprobante'),
            "estado" : request.json.get('estado')
            }

    result = db.order.insert_one(order)
    return flask.jsonify(message="success", id=str(result.inserted_id)), 200

@order.route("/order", methods=['GET'])
def get_orders():
    order = db.order.find()
    response = json_util.dumps(order)
    return Response(response, mimetype="application/json")

@order.route("/order/<idUser>/user", methods=['GET'])
def get_orders_user(idUser):
    order = db.order.find({'idUser' : idUser})
    response = json_util.dumps(order)
    return Response(response, mimetype="application/json")

@order.route("/order/<idProduct>/product", methods=['GET'])
def get_orders_product(idProduct):
    order = db.order.find({'idProduct' : idProduct})
    response = json_util.dumps(order)
    return Response(response, mimetype="application/json")

@order.route('/order/<id>', methods=['GET'])
def get_order(id):
    order = db.order.find_one({'_id': ObjectId(id) })
    response = json_util.dumps(order)
    return Response(response, mimetype="application/json")

@order.route('/order/<id>', methods=['DELETE'])
def delete_order(id):

    data = {"_id" : ObjectId(id)}

    db.order.delete_one(data)

    response = jsonify({'message': 'order ' + id + ' ha sido eliminado.'})
    response.status_code = 200
    return response

@order.route('/order/<id>/approve', methods=['PUT'])
def approve_order(id):
    estado = request.json.get('estado')

    array_id = {
        "_id" : ObjectId(id)
    }

    data = {
        '$set': {
            "estado" : estado
        }
    }
    
    db.order.update_one(array_id, data)
    response = jsonify({'message': 'order ' + id + ' Updated Successfuly'})
    response.status_code = 200
    return response

@order.route('/order/<_id>', methods=['PUT'])
def update_order(_id):
    idUser = request.json.get('idUser')
    idPayment = request.json.get('idPayment')
    idProduct = request.json.get('idProduct')
    comprobante = request.json.get('comprobante')
    estado = request.json.get('estado')

    array_id = {
        "_id" : ObjectId(_id)
    }

    data = {
        '$set': {
            "idUser": idUser,
            "idPayment": idPayment,
            "idProduct" : idProduct,
            "comprobante" : comprobante,
            "estado" : estado
        }
    }
    
    db.order.update_one(array_id, data)
    response = jsonify({'message': 'order ' + _id + ' Updated Successfuly'})
    response.status_code = 200
    return response

@order.route('/grafo', methods=['POST'])
def set_grafo():
    productos =json.loads(request.json.get('productos'))
    anterior=productos[0]["_id"]["$oid"]
    #totalOrdenes=list(db.order.find({'idProduct':anterior}))
    #print(totalOrdenes)
    
    for producto in productos:
        OrdenesProductoActual=list(db.order.find({'idProduct':producto["_id"]["$oid"]}))
        
        if len(OrdenesProductoActual)==0:
            cantidad=1
        else:
            cantidad=len(OrdenesProductoActual)+1
        print(cantidad)
        print(producto["_id"]["$oid"])
        addNode(producto["_id"]["$oid"])
        if(anterior != producto["_id"]["$oid"]):
            addRelation(anterior, producto["_id"]["$oid"],1/cantidad)
        if(anterior != producto["_id"]["$oid"]):
            anterior=producto["_id"]["$oid"]

    print(distanceCalculate())
    #result = db.order.insert_one(order)
    #return flask.jsonify(message="success", id=str(result.inserted_id)), 200
    return flask.jsonify(message="success"), 200

@order.route('/recomendaciones/<productoInicial>', methods=['GET'])
def get_grafo(productoInicial):
    #productoInicial='64c1f5732039599187fd42b2'
    respuesta=distanceCalculate()
    if(len(respuesta)==0):
        return flask.jsonify(message="success"), 200
    respuestaProducto=respuesta[productoInicial]
    print(respuesta)
    print(",,,,.......")
    recomendaciones = {k: v for k, v in respuestaProducto.items() if not k.startswith(productoInicial)}
    
    print(list(recomendaciones))
    response = jsonify({"respuesta":recomendaciones})
    response.status_code = 200
    return response

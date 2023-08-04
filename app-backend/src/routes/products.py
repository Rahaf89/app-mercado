############# From ################

from flask import Blueprint, Flask, request, jsonify, Response
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import json_util
from bson.objectid import ObjectId
import re
############# Import ##############

import os
import json
import flask
import time

product = Blueprint('product', __name__)

appRea = Flask(__name__) 
appRea.config['UPLOAD_FOLDER'] =  os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))),"files", "products")
appRea.config["MONGO_URI"] = "mongodb://localhost:27017/DBMercado"
CORS(appRea)

mongodb_client = PyMongo(appRea)
db = mongodb_client.db

#############
#   Peticion POST
#   Enviamos un archivo PDF, el mismo sera guardado en el sistema y ademas se guardaran los datos
#   de la evaluacion.
###########
@product.route('/product', methods=['POST'])
def set_product():
    if not request.files:
        print("hola mundo")
        data = {'message' : 'Sent failed!'}
        return jsonify(isError= True, message= "Error", statusCode= 400, data = data), 400

    else:
        # obtenemos el archivo del input "archivo"
        f = request.files['archivo']

        filename = time.strftime("%Y%m%d%H%M%S") + '-producto.png'

        if f.filename.find(".jpg") != -1:
            filename = time.strftime("%Y%m%d%H%M%S") + '-producto.jpg'

        if f.filename.find(".jepg") != -1:
            filename = time.strftime("%Y%m%d%H%M%S") + '-producto.jpeg'
        
        # Guardamos el archivo en el directorio "Archivos PDF"
        f.save(os.path.join(appRea.config['UPLOAD_FOLDER'], filename))

        product = {
                    "nombre": request.form.get('nombre'),
                    "formato": request.files['archivo'].content_type,
                    "codigo": request.form.get('codigo'),
                    "cantidad" : request.form.get('cantidad'),
                    "estado": request.form.get('estado'),
                    "precio": request.form.get('precio'),
                    "moneda": request.form.get('moneda'),
                    "descripcion": request.form.get('descripcion'),
                    "imagen" : filename,
                    "tipo" : "producto",
                    "createById" : request.form.get('idUser'),
                    "idCategory" : request.form.get('idCategory')
                    }

        result = db.product.insert_one(product)

        # Retornamos una respuesta satisfactoria
        data = {'message' : 'Sent Successfull', 'name' : filename, 'id' : str(result.inserted_id)}

        return jsonify(isError= False, message= "Success", statusCode= 200, data = data), 200
    
@product.route('/product/image/<path:filename>')
def get_image(filename):
    return jsonify({'image': appRea.config['UPLOAD_FOLDER'] + filename})

@product.route("/product", methods=['GET'])
def get_products():
    product = db.product.find({}, {"nombre": 1, 
                                   "formato": 1, 
                                   "codigo": 1, 
                                   "estado": 1,
                                   "precio": 1, 
                                   "cantidad": 1,
                                   "moneda": 1, 
                                   "descripcion": 1, 
                                   "imagen": 1,
                                   "tipo": 1,
                                   "createById" : 1,
                                   "idCategory" : 1,
                                   "_id": 1})
    response = json_util.dumps(product)
    return Response(response, mimetype="application/json")

@product.route("/product/<id>/create", methods=['GET'])
def get_products_by_create(id):
    product = db.product.find({'id' : ObjectId(id)}, {"nombre": 1, 
                                            "formato": 1, 
                                            "codigo": 1, 
                                            "estado": 1,
                                            "precio": 1, 
                                            "cantidad": 1,
                                            "moneda": 1, 
                                            "descripcion": 1, 
                                            "imagen": 1,
                                            "tipo": 1,
                                            "createById" : 1,
                                            "idCategory" : 1,
                                            "_id": 1})
    response = json_util.dumps(product)
    return Response(response, mimetype="application/json")

@product.route('/product/<id>/info', methods=['GET'])
def get_product_info(id):
    product = db.product.find_one({'_id': ObjectId(id) }, {"nombre": 1, 
                                                            "formato": 1, 
                                                            "codigo": 1, 
                                                            "estado": 1,
                                                            "precio": 1, 
                                                            "cantidad": 1,
                                                            "moneda": 1, 
                                                            "descripcion": 1, 
                                                            "imagen": 1,
                                                            "tipo": 1,
                                                            "idCategory" : 1,
                                                            "_id": 1})
    response = json_util.dumps(product)
    return Response(response, mimetype="application/json")


@product.route('/product/<id>', methods=['GET'])
def get_product(id):
    product = db.product.find_one({'_id': ObjectId(id) })
    response = json_util.dumps(product)
    return Response(response, mimetype="application/json")

@product.route('/product/<createById>/onlyCreate', methods=['GET'])
def get_product_course(createById):
    products = db.product.find({'createById': createById})
    response = json_util.dumps(products)
    return Response(response, mimetype="application/json")

@product.route('/product/<id>', methods=['DELETE'])
def delete_product(id):

    data = {
        "_id" : ObjectId(id)
    }

    db.product.delete_one(data)
    response = jsonify({'message': 'El producto ' + id + ' ha sido eliminado.'})
    response.status_code = 200
    return response

@product.route('/product/<_id>', methods=['PUT'])
def update_product(_id):
    product = db.product.find_one({'_id': ObjectId(_id) })
    filename = product["imagen"]
    if not request.files:
        data = {'message' : 'Sent failed!'}
        return jsonify(isError= True, message= "Error", statusCode= 400, data = data), 400
    else:
        # obtenemos el archivo del input "archivo"
        f = request.files['archivo']

        filename = time.strftime("%Y%m%d%H%M%S") + '-producto.png'
        if f.filename.find(".jpg") != -1:
            filename = time.strftime("%Y%m%d%H%M%S") + '-producto.jpg'

        if f.filename.find(".jpg") != -1:
            filename = time.strftime("%Y%m%d%H%M%S") + '-producto.jpeg'

        try:
            os.unlink(os.path.join(appRea.config['UPLOAD_FOLDER'], product["imagen"]))
        except:
            print(os.path.join(appRea.config['UPLOAD_FOLDER'], product["imagen"]))
            print("Archivo no existe")

        # Guardamos el archivo en el directorio "Archivos PDF"
        f.save(os.path.join(appRea.config['UPLOAD_FOLDER'], filename))
    
    nombre = request.form.get('nombre')
    codigo = request.form.get('codigo')
    estado = request.form.get('estado')
    precio = request.form.get('precio')
    cantidad = request.form.get('cantidad')
    moneda = request.form.get('moneda')
    descripcion = request.form.get('descripcion')
    idCategory = request.form.get('idCategory')
    imagen= filename
    array_id = {
        "_id" : ObjectId(_id)
    }

    data = {
        '$set': {
            "nombre": nombre,
            "codigo": codigo,
            "estado": estado,
            "precio": precio,
            "cantidad": cantidad,
            "moneda": moneda,
            "descripcion": descripcion,
            "imagen" : imagen,
            "idCategory" : idCategory
        }
    }
    
    db.product.update_one(array_id, data)

    response = jsonify({'message': 'product ' + _id + ' Updated Successfuly'})
    response.status_code = 200
    return response

@product.route('/productWithoutImage/<_id>', methods=['PUT'])
def update_product_withoutimage(_id):
    nombre = request.form.get('nombre')
    codigo = request.form.get('codigo')
    estado = request.form.get('estado')
    precio = request.form.get('precio')
    cantidad = request.form.get('cantidad')
    moneda = request.form.get('moneda')
    descripcion = request.form.get('descripcion')
    idCategory = request.form.get('idCategory')
    array_id = {
        "_id" : ObjectId(_id)
    }

    data = {
        '$set': {
            "nombre": nombre,
            "codigo": codigo,
            "estado": estado,
            "precio": precio,
            "cantidad": cantidad,
            "moneda": moneda,
            "descripcion": descripcion,
            "idCategory" : idCategory
        }
    }
    
    db.product.update_one(array_id, data)

    response = jsonify({'message': 'product ' + _id + ' Updated Successfuly'})
    response.status_code = 200
    return response
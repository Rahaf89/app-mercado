from flask import Blueprint, Flask, request, jsonify, Response
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import json_util
from bson.objectid import ObjectId
import flask
import hashlib

user = Blueprint('user', __name__)

appUser = Flask(__name__) 
appUser.config["MONGO_URI"] = "mongodb://localhost:27017/DBMercado"
CORS(appUser)

mongodb_client = PyMongo(appUser)
db = mongodb_client.db

@user.route('/user', methods=['POST'])
def set_user():
    m = hashlib.sha256()
    password = request.json.get('password')
    password_encode = password.encode()
    m.update(password_encode)

    user = {"nombres": request.json.get('nombres'),
            "apellidos": request.json.get('apellidos'),
            "cargo": request.json.get('cargo'),
            "correo": request.json.get('correo'),
            "cedula": request.json.get('cedula'),
            "createBy" : request.json.get('createBy'),
            "createByName" : request.json.get('createByName'),
            "role" : request.json.get('role'),
            "password" : m.hexdigest()}

    result = db.user.insert_one(user)
    return flask.jsonify(message="success", id=str(result.inserted_id)), 200

@user.route("/user", methods=['GET'])
def get_users():
    user = db.user.find({}, {"nombres": 1, 
                            "apellidos": 1, 
                            "cargo": 1, 
                            "correo": 1,  
                            "cedula": 1,
                            "createBy" : 1,
                            "createByName" : 1,
                            "role" : 1})
    response = json_util.dumps(user)
    return Response(response, mimetype="application/json")

@user.route("/user/<createBy>/create", methods=['GET'])
def get_users_by_create(createBy):
    user = db.user.find({'createBy' : createBy})
    response = json_util.dumps(user)
    return Response(response, mimetype="application/json")

@user.route('/user/<id>', methods=['GET'])
def get_user(id):
    user = db.user.find_one({'_id': ObjectId(id) }, {"nombres": 1, 
                                                    "apellidos": 1, 
                                                    "cargo": 1, 
                                                    "correo": 1,  
                                                    "cedula": 1,
                                                    "createBy" : 1,
                                                    "createByName" : 1,
                                                    "role" : 1})
    response = json_util.dumps(user)
    return Response(response, mimetype="application/json")

@user.route('/user/<email>/email', methods=['GET'])
def get_data_user_mail(email):
    user = db.user.find_one({'correo': email }, {"nombres": 1, 
                                                "apellidos": 1, 
                                                "cargo": 1, 
                                                "correo": 1,  
                                                "cedula": 1,
                                                "createBy" : 1,
                                                "createByName" : 1,
                                                "role" : 1})
    response = json_util.dumps(user)
    return Response(response, mimetype="application/json")

# @user.route('/user/<id>/<createBy>', methods=['GET'])
# def get_user_by_create(id, createBy):
#     user = db.user.find_one({'_id': ObjectId(id), 'createBy': createBy })
#     response = json_util.dumps(user)
#     return Response(response, mimetype="application/json")

@user.route('/user/email', methods=['POST'])
def get_user_by_email():
    correo = request.json.get('correo')
    
    m = hashlib.sha256()
    password = request.json.get('password')
    password_encode = password.encode()
    m.update(password_encode)
    
    user = db.user.find_one({'correo': correo, 'password': m.hexdigest()}, {"nombres": 1, 
                                                                                  "apellidos": 1, 
                                                                                  "cargo": 1, 
                                                                                  "correo": 1,  
                                                                                  "cedula": 1,
                                                                                  "createBy" : 1,
                                                                                  "createByName" : 1,
                                                                                  "role" : 1})
    response = json_util.dumps(user)
    return Response(response, mimetype="application/json")

@user.route('/user/<id>', methods=['DELETE'])
def delete_user(id):

    data = {
        "_id" : ObjectId(id)
    }

    db.user.delete_one(data)
    response = jsonify({'message': 'User ' + id + ' ha sido eliminado.'})
    response.status_code = 200
    return response

@user.route('/user/<_id>', methods=['PUT'])
def update_user(_id):
    
    nombres = request.json.get('nombres')
    apellidos = request.json.get('apellidos')
    cargo = request.json.get('cargo')
    correo = request.json.get('correo')
    cedula = request.json.get('cedula')
    role = request.json.get('role')

    array_id = {
        "_id" : ObjectId(_id)
    }

    data = {
        '$set': {
            "nombres": nombres,
            "apellidos": apellidos,
            "cargo": cargo,
            "correo" : correo,
            "cedula" : cedula,
            "role" : role
        }
    }
    
    db.user.update_one(array_id, data)
    response = jsonify({'message': 'User ' + _id + ' Updated Successfuly'})
    response.status_code = 200
    return response

@user.route('/user/<_id>/role', methods=['PUT'])
def update_user_role(_id):
    
    role = request.json.get('role')

    array_id = {
        "_id" : ObjectId(_id)
    }

    data = {
        '$set': {
            "role" : role
        }
    }
    
    db.user.update_one(array_id, data)
    response = jsonify({'message': 'User ' + _id + ' Updated Successfuly'})
    response.status_code = 200
    return response

@user.route('/user/<_id>/changepassword', methods=['PUT'])
def update_password(_id):
    
    password = request.json.get('password')
    m = hashlib.sha256()
    password_encode = password.encode()
    m.update(password_encode)

    array_id = {
        "_id" : ObjectId(_id)
    }

    data = {
        '$set': {
            "password": m.hexdigest(),
        }
    }
    
    db.user.update_one(array_id, data)
    response = jsonify({'message': 'User ' + _id + ' Updated Successfuly'})
    response.status_code = 200
    return response

@user.route('/user/<_id>/password', methods=['PUT'])
def update_password_user(_id):
    
    passwordCurrent = request.json.get('passwordCurrent')
    password = request.json.get('password')

    m = hashlib.sha256()
    password_encode = passwordCurrent.encode()
    m.update(password_encode)

    user = db.user.find_one({'_id': ObjectId(_id) }, {"password": 1})

    if(user["password"] == m.hexdigest()):
        m2 = hashlib.sha256()
        password_encode2 = password.encode()
        m2.update(password_encode2)

        array_id = {
            "_id" : ObjectId(_id)
        }

        data = {
            '$set': {
                "password": m2.hexdigest(),
            }
        }
        
        db.user.update_one(array_id, data)
        response = jsonify({'message': 'La contraseña ha sido cambiada', 'status' : 200})
        response.status_code = 200
    else:
        response = jsonify({'message': 'La contraseña actual no es la correcta', 'status' : 400})
        response.status_code = 400

    return response
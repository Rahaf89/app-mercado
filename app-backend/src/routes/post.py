from flask import Blueprint, Flask, request, jsonify, Response
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import json_util
from bson.objectid import ObjectId
import flask
import os, sys
sys.path.append(os.path.dirname((os.path.dirname(os.path.realpath(__file__)))))
from src.threadsAPI import threadsByUser
from src.fakeNewsAPI import *
post = Blueprint('post', __name__)

appOrd = Flask(__name__) 
appOrd.config['UPLOAD_FOLDER'] = 'src/files/'
appOrd.config["MONGO_URI"] = "mongodb://localhost:27017/DBMercado"
CORS(appOrd)

mongodb_client = PyMongo(appOrd)
db = mongodb_client.db

@post.route("/post", methods=['GET'])
def get_posts():
    post = threadsByUser('supermercadopelao', 10)
    response = json_util.dumps(post)
    return Response(response, mimetype="application/json")


@post.route('/post/<username>/user', methods=['GET'])
def get_post(username):
    post = threadsByUser(username, 10)
    response = json_util.dumps(post)
    return Response(response, mimetype="application/json")

@post.route('/post/<publicacion>/publicacion', methods=['GET'])
def get_fakeNews_post(publicacion):
    salida=detectFakeNews(publicacion)
    response = json_util.dumps(salida)
    return Response(response, mimetype="application/json")

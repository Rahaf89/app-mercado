from pywebpush import webpush, WebPushException
from src.common.notificationCredencial import VAPID_PRIVATE_KEY, VAPID_CLAIM_EMAIL
from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS

appNoti = Flask(__name__) 
appNoti.config['UPLOAD_FOLDER'] = 'src/files/'
appNoti.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabaseTG"
CORS(appNoti)

mongodb_client = PyMongo(appNoti)
db = mongodb_client.db

def __send_push_notification(push_subscription, title, body):
    try:   
        idSeleccionado=push_subscription['_id']
        del push_subscription['_id']
        del push_subscription['expirationTime']
        del push_subscription['usuario']
        payload='''{
            "notification": {
                "title":  "%s",
                "body":  "%s",
                "vibrate": [100, 50, 100],
                "image": "assets/img/LogoFondoGris.png",
                "actions": [{
                    "action": "explore",
                    "title": "Ir al sitio"
                }]
            }
        }''' % (title, body)

        response = webpush(
            subscription_info= push_subscription,
            data=payload,
            vapid_private_key=VAPID_PRIVATE_KEY,
            vapid_claims={"sub": VAPID_CLAIM_EMAIL}
        )
        return response.ok
    except WebPushException as ex:
        if(ex.response.status_code==410):
            db.notification.delete_one({'_id':idSeleccionado})
        return False

def registrer_push_notification(notification, usuario_email):
    notification.update({'usuario':usuario_email})
    return db.notification.insert_one(notification)

def send_notification_all(title, body):
    subscriptions = db.notification.find()
    return [__send_push_notification(subscription, title, body)
            for subscription in subscriptions]

def send_notification_one(title, body, user_email):
    subscriptions = db.notification.find({"usuario": user_email})
    return [__send_push_notification(subscription, title, body)
            for subscription in subscriptions]

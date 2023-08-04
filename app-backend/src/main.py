############# From ################
import sys
print(sys.version)
from flask import Flask
from flask_cors import CORS
from src.routes.routes import add_blueprint
#from flask_pywebpush import WebPush
# Ajustando APP Config
app = Flask(__name__) 
#push = WebPush(app)
CORS(app, support_credentials=True)

app.config['WEBPUSH_VAPID_PRIVATE_KEY'] = "3cfP8I7iirHPmhcvMraAhZkQ4t3Bv3MiLgApo0T0jIw"
app.config['WEBPUSH_VAPID_CLAIMS'] = {"sub": "mailto:javiloria100@gmail.com"}

@app.route('/', methods=['GET'])
def set_course():
	return "Servidor dle Super Mercado PELAO"

add_blueprint(app)

def create_app():
	return app

#La siguiente linea se debe comentar en las pruebas y en el server Linode
app.run()

# COLOCAR ESTE METODO PARA PONER EL BACKEND EN PRODUCCION
#app.run(host='0.0.0.0', port=5000)
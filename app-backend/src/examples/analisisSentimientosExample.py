import sys, os;

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(__file__)))))
from src.analisisSentimientosAPI import analisisSentimientos


sentences = ["¡Me encantan los artículos del supermercardo PELAO, son lo máximo!", 
                    "Odio las ofertas en licores del supermercado PELAO, no sirven para nada.", 
                    "El super es medio bueno; me gustaron algunos precios, no hay tanta variedad de productos."]


salida=[]
for sentence in sentences:
    salida.append(analisisSentimientos(sentence))

print(salida)
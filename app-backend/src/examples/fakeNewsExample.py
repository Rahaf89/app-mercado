import sys, os;
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(__file__)))))
from src.fakeNewsAPI import detectFakeNews

text='''El supermercado PELAO suspende operaciones comerciales tras incendio mortal de su tienda.
    El CEO de la compañía, Peter M. Kern, estuvo entre los que fallecieron en el desastre al norte 
    de España. Europa el mes pasado. "PELAO ha suspendido todas las operaciones comerciales", 
    dijo la compañía este jueves en su sitio web oficial.'''

salida=detectFakeNews(text)

print(salida)
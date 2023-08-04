
import sys, os;
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(__file__)))))
from src.threadsAPI import threadsByUser
salida=threadsByUser('supermercadopelao', 4)

print(salida)
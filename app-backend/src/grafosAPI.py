import networkx as nx
import os, sys
G = nx.Graph()
sys.path.append(os.path.dirname(os.path.realpath(__file__)))
G = nx.read_gpickle(os.path.join(os.path.dirname(os.path.realpath(__file__)),"grafoFile\grafo.gpickle"))
#Creacion de Nodos
#G.add_node(1)
#Creacion de multiples nodos (No deberia aplicar para el proyecto)
#G.add_nodes_from([2, 3])
#Agregando relaciones entre nodos en prinicipo sera cuando un uusario compre 2 productos en el mismo carrito

#G.nodes[1][2] = 200
#agregando relacion pero con peso
#G.add_edge(1, 2, weight=212)

#print(G.nodes)
#print(G.edges)
#print(G.edges[1,2])
#Calcular la distancia mas corta dado el peso
#print(dict(nx.all_pairs_dijkstra_path_length(G)))

#Salvar el grafo
#nx.write_gpickle(G,os.path.join(os.path.dirname(os.path.realpath(__file__)),"grafoFile\grafo.gpickle"))

#Leer el grafo
#H = nx.read_gpickle("grafoFile/grafo.gpickle")

#print("aaaaa")
#print(H.nodes)
#print(H.edges)

def addNode(node):
    G.add_node(node)
    nx.write_gpickle(G, os.path.join(os.path.dirname(os.path.realpath(__file__)),"grafoFile\grafo.gpickle"))

def addRelation(node1, node2, weight):
    G.add_edge(node1, node2, weight=weight)
    nx.write_gpickle(G, os.path.join(os.path.dirname(os.path.realpath(__file__)),"grafoFile\grafo.gpickle"))

def distanceCalculate():
    return dict(nx.all_pairs_dijkstra_path_length(G))
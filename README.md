# Supermercado PELAO
Este repositorio permite gestionar las versiones del Supermercado PELAO

### Como ejecutar el Proyecto
Es necesario utilizar 2 terminales, una para el FrontEnd y otra para el Backend, se deben descargar las dependencias en el Front-End y Backend


#### Como ejecutar el servidor FrontEnd (Terminal 1)
```bash

$ cd app-front
$ npm install
$ npm start
```
#### Realizar proceso de instalación en el BackEnd (Terminal 1)
```bash

$ cd app-backend
$ EntornoVirtual\Scripts\activate.bat
$ pip install -r requirements.txt
```

#### Como ejecutar el servidor BackEnd (Terminal 1)
```bash

$ cd app-backend
$ python o py -m src.main
```

### Como ejecutar la IA y las consultas a la redes sociales:
Es necesario ubicarse en la carpeta app-backend/src/examples

```bash
$ cd app-backend/src/examples
```

Ejecución de analisis de sentimientos:
```bash
$ python analisisSentimientosExample.py
```

Ejecución de Fake News
```bash
$ python fakeNewsExample.py
```

Recopilar info de redes sociales (Threads de un usuario):
```bash
$ python ThreadsExample.py
```
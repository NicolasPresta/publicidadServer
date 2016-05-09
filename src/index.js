// Imports
import http from 'http'
import express from 'express'
import bodyParser from "body-parser"
import Log from 'log'

import routerPublicidades from './api/routerPublicidades'
import routerSucursales from './api/routerSucursales'
import routerCatalogo from './api/routerCatalogo'
import routerUser from './api/routerUser'

import appConfig from './config/config'
import mongoose from 'mongoose'

// Definicion de constantes//asd
const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 3002
const log = new Log(appConfig.LogLevel)

mongoose.connect('mongodb://localhost/test');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	//Solo iniciamos el servidor si la conexión con la base de datos fue exitosa
	log.info('Conexión exitosa con la base de datos');

	// Middlewares
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
		extended: true
	}));

	// Configuración para permitir peticiones CORS (desde otros dominios)
	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});

	// Puntos de entrada REST
	app.use('/user', routerUser);
	app.use('/sucursales', routerSucursales);
	app.use('/publicidades', routerPublicidades);
	app.use('/productos', routerCatalogo);

	// Permite servir los archivos estaticos de la carpeta /public
	app.use(express.static('public'))

	// Nos ponemos a escuchar... hello!
	server.listen(port, () => log.info(`Servidor Iniciado en puerto ${port}`))
});

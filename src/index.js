// Imports
import http from 'http'
import express from 'express'
import bodyParser from "body-parser"
import Log from 'log'
import router from './api/router'
import appConfig from './config/config'

// Definicion de constantes
const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 3002
const log = new Log(appConfig.LogLevel)

// Middlewares
app.use(bodyParser.json())

// Puntos de entrada REST
app.use(router)

// Permite servir los archivos estaticos de la carpeta /public
app.use(express.static('public'))

// Nos ponemos a escuchar... hello! 
server.listen(port, () => log.info(`Servidor Iniciado en puerto ${port}`))

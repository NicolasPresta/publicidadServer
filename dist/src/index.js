'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _log = require('log');

var _log2 = _interopRequireDefault(_log);

var _router = require('./api/router');

var _router2 = _interopRequireDefault(_router);

var _config = require('./config/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Definicion de constantes
// Imports
var app = (0, _express2.default)();
var server = _http2.default.createServer(app);
var port = process.env.PORT || 3002;
var log = new _log2.default(_config2.default.LogLevel);

// Middlewares
app.use(_bodyParser2.default.json());

// Puntos de entrada REST
app.use(_router2.default);

// Permite servir los archivos estaticos de la carpeta /Cliente (necesario para levantar los clientes y cajas dummys)
app.use(_express2.default.static('public'));

// Nos ponemos a escuchar... hello!
server.listen(port, function () {
  return log.info('Servidor Iniciado en puerto ' + port);
});
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _publicidadManager = require('../lib/publicidadManager');

var _publicidadManager2 = _interopRequireDefault(_publicidadManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// Puntos de entrada REST

// Envia todas las publicidades
router.get('/publicidades', function (req, res) {

  _publicidadManager2.default.getAll(function (err, publicidades) {
    if (err) {
      return res.sendStatus(500).json(err);
    }

    res.json(publicidades);
  });
});

exports.default = router;
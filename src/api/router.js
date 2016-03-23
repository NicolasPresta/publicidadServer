import express from 'express'
import publicidadManager from '../lib/publicidadManager'
import Log from 'log'
import appConfig from '../config/config'

const log = new Log(appConfig.LogLevel)
const router = express.Router();


// Puntos de entrada REST

// Envia todas las publicidades
router.get('/publicidades/:uuid', (req, res) => {
	
  log.debug("nuevo request de /publicidades " + req)

  let uuid = req.params.uuid

  log.debug("desde acá se hizo el request UUID: " + uuid)

  publicidadManager.getAll((err, publicidades) => {
    if (err) {
      return res.sendStatus(500).json(err)
    }

     res.json(publicidades)

  })

  // TODO: Mandar a grabar registro de la accion (uuid)
});

router.get('/publicidad/:uuid/:id', (req, res) => {

  log.debug("nuevo request de /publicidad " + req)

  let id = req.params.id
  let uuid = req.params.uuid

  log.debug("desde acá se hizo el request UUID: " + uuid)

  publicidadManager.getById(id, (err, publicidad) => {
    if (err) {
      return res.sendStatus(500).json(err)
    }

     res.json(publicidad)

  })

  // TODO: Mandar a grabar registro de la accion (uuid)
});

router.get('/ver/:id/', (req, res) => {

  log.debug("nuevo request de /ver " + req)

  let id = req.params.id

  publicidadManager.getById(id, (err, publicidad) => {
    if (err) {
      return res.sendStatus(500).json(err)
    }

     //res.json(publicidad)

    res.sendFile('/public/index.html', { root: __dirname + '/..'});

  })

  // TODO: Mandar a grabar registro de la accion (uuid)
});

router.post('/phoneData', (req, res) => {
 
  var uuid = req.body.uuid;
  var DeviceId = req.body.DeviceId;
  var SubscriberId = req.body.SubscriberId;
  var SimSerialNumber = req.body.SimSerialNumber;
  var Line1Number = req.body.Line1Number;
  var NetworkCountryIso = req.body.NetworkCountryIso;
  var NetworkOperatorName = req.body.NetworkOperatorName;
  var MANUFACTURER = req.body.MANUFACTURER;
  var MODEL = req.body.MODEL;
  var SDK_INT = req.body.SDK_INT;


 log.debug("nuevo request de /phoneData " + uuid + " - " + 
                                        DeviceId + " - " + 
                                        SubscriberId + " - " + 
                                        SimSerialNumber + " - " + 
                                        Line1Number + " - " + 
                                        NetworkCountryIso + " - " + 
                                        NetworkOperatorName + " - " + 
                                        MANUFACTURER + " - " + 
                                        MODEL + " - " + 
                                        SDK_INT)

  res.sendStatus(200);
});

router.post('/userData', (req, res) => {
 
  var uuid = req.body.uuid;
  var Sexo = req.body.Sexo;
  var FechaNacimiento = req.body.FechaNacimiento;
  var Cuentas = req.body.Cuentas;

 log.debug("nuevo request de /userData " + uuid + " - " + 
                                        Sexo + " - " + 
                                        FechaNacimiento + " - " + 
                                        Cuentas )

  res.sendStatus(200);
});


export default router
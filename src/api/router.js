import express from 'express'
import publicidadManager from '../lib/publicidadManager'
import Log from 'log'
import appConfig from '../config/config'
import publicidadTemplate from '../templates/publicidadTemplate'
import mustache from 'mustache'

const log = new Log(appConfig.LogLevel)
const router = express.Router();


// Puntos de entrada REST

// Envia todas las publicidades en formato json
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

// Envia una publicidad en forma json
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

// Para mostrar desde el explorador web una publicidad (html)
// Esto se usa pues cuando se comparte una publicidad (por whatsapp, por facebook, por etc) lo que se comparte
// Es un Link del tipo "http://www.micomercio.com/verpromo/51911"
// Y ahí les muestra la promo. 
// IDEM app de mercadolibre o de letgo o de alamaula o de olx o cualquier otra.
router.get('/verpromo/:id/', (req, res) => {

  log.debug("nuevo request de /verpromo " + req)

  let id = req.params.id

  publicidadManager.getById(id, (err, publicidad) => {
    if (err) {
      return res.sendStatus(500).json(err)
    }

    // Mustache es basicamente un motor de plantillas html para node (para mas info de como funciona mustache buscar en google)
    var html = mustache.to_html(publicidadTemplate, publicidad);

    res.send(html)
  })

  // TODO: Mandar a grabar registro de la accion (uuid)
});

// Recibe los datos de un dispositivo y los almacena
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

// Recibe los datos de un usuario de dispositivo y los almacena
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

// Recibe los datos de ubicaciones de un dispositivo y los almacena
router.post('/gpsData', (req, res) => {
 
  var uuid = req.body.uuid;
  var ubicaciones = JSON.stringify(req.body.Ubicaciones);


 log.debug("nuevo request de /gpsData " + uuid + " - " + 
                                        ubicaciones )

  res.sendStatus(200);
});


export default router
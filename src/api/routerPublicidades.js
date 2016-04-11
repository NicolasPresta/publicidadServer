import express from 'express'
import publicidadManager from '../lib/publicidadManager'
import Log from 'log'
import appConfig from '../config/config'
import publicidadTemplate from '../templates/publicidadTemplate'
import mustache from 'mustache'

const log = new Log(appConfig.LogLevel)
const router = express.Router();


// Puntos de entrada REST

// get /publicidades/ - devuelve todas las publicidades
router.get('/', (req, res) => {
	
  log.debug("nuevo request de /publicidades " + req)

  let uuid = req.query.uuid

  log.debug("desde acá se hizo el request UUID: " + uuid)

  publicidadManager.getAll((err, publicidades) => {
    if (err) {
      return res.sendStatus(500).json(err)
    }

     res.json(publicidades)

  })

  // TODO: Mandar a grabar registro de la accion (uuid)
});

// get /publicidades/:id - recive un id de publicidad y devuelve esa misma
router.get('/:id', (req, res) => {

  log.debug("nuevo request de /publicidad " + req)

  let id = req.params.id
  let uuid = req.query.uuid

  log.debug("desde acá se hizo el request UUID: " + uuid)

  publicidadManager.getById(id, (err, publicidad) => {
    if (err) {
      return res.sendStatus(500).json(err)
    }

     res.json(publicidad)

  })

  // TODO: Mandar a grabar registro de la accion (uuid)
});

//get /publicidades/verpromo/:id
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

export default router
import express from 'express'
import publicidadManager from '../lib/publicidadManager'
import Log from 'log'
import appConfig from '../config/config'

const log = new Log(appConfig.LogLevel)
const router = express.Router();


// Puntos de entrada REST

// Envia todas las publicidades
router.get('/publicidades', (req, res) => {

  log.debug("nuevo request " + req)
  publicidadManager.getAll((err, publicidades) => {
    if (err) {
      return res.sendStatus(500).json(err)
    }

     res.json(publicidades)

  })

});



export default router
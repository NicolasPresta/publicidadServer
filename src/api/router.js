import express from 'express'
import publicidadManager from '../lib/publicidadManager'

const router = express.Router();


// Puntos de entrada REST

// Envia todas las publicidades
router.get('/publicidades', (req, res) => {

  publicidadManager.getAll((err, publicidades) => {
    if (err) {
      return res.sendStatus(500).json(err)
    }

     res.json(publicidades)

  })

});



export default router
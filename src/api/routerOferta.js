/**
 * Created by Artiom on 27/05/2016.
 */
import express from 'express'
import ofertasManager from '../lib/ofertasManager'
import imagesManager from '../lib/imagesManager'
import Log from 'log'
import appConfig from '../config/config'
import fs from 'fs-extra'
import multer from 'multer'

import path from 'path'

const log = new Log(appConfig.LogLevel)
const router = express.Router();

const CONFIG_IMAGENES = {
	PRE_PROCESS: './uploads/process/ofertas/',
	READY: './uploads/ready/ofertas/',
	SIZES: [{
		DESC: 'small',
		WIDTH: 320
	}, {
		DESC: 'medium',
		WIDTH: 768
	}, {
		DESC: 'large',
		WIDTH: 1080
	}]
};

//Multer es una biblioteca para gestionar subidas de archivos, acá se define la ruta donde va a guardar los archivos
//y el nombre con el que los va a guardar
const storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, CONFIG_IMAGENES.PRE_PROCESS)
	},
	filename: function(req, file, cb){
		//var datetimestamp = Date.now();
		cb(null, req.params.id + '.' + file.originalname.split('.')[file.originalname.split('.').length-1])
	}
});

const filterImages = function(req, file, cb) {
	let type = file.mimetype;
	console.log(type);
	if (type == 'image/jpeg' || type == 'image/png'){
		console.log('todo bien, que suba');
		cb(null, true);
	} else {
		console.log('esta no se puede subir');
		return cb(new Error('Solo se aceptan imágenes png y jpeg'));
	}
}

const upload = multer({
	storage: storage,
	fileFilter: filterImages
}).single('oferta');

//get /ofertas/ - devuelve todos los productos
router.get('/', (req, res) => {
	let param = req.query;
	Object.keys(param).forEach(function(key, index){
		param[key] = {
			$regex: param[key],
			$options: 'i'
		}
	});
	ofertasManager.getAll(param, (err, ofertas) => {
		if (err){
			res.status(500).json(err)
		} else {
			res.json(ofertas)
		}
	})

})

//get /ofertas/imagen/:id - recibe id de la oferta, devuelve imagen
router.get('/imagen/:id', (req, res) => {
	let idOferta = req.params.id;
	let tamaño = req.query.size || 'large';
	ofertasManager.getImageById(idOferta, (err, doc) => {
		if (err){
			res.status(500).json(err)
		} else if (doc.imagen){
			fs.readFile(path.join(CONFIG_IMAGENES.READY, idOferta + '-' + tamaño + '.' + doc.imagen.extension), (err, imagen) => {
				res.set('Content-Type', doc.imagen.mimetype);
				res.send(imagen);
			})

		}
	})
})

//post /ofertas/nueva/imagen/:id - se sube la imagen de la oferta
router.post('/nueva/imagen/:id', (req, res) => {
	upload(req, res, function(err){
		if (err){
			res.json({error_code:1, err_desc:err});
			return;
		}
		let imageExt = req.file.originalname.split('.')[req.file.originalname.split('.').length-1];
		imagesManager.getImageSize(CONFIG_IMAGENES, req.params.id, imageExt, (size) => {
			var aspectRatio = size.width / size.height;
			imagesManager.processImage(CONFIG_IMAGENES, req.params.id, imageExt, (err, results) => {
				if (!err){
					ofertasManager.saveImage(req.params.id, req.file.mimetype, imageExt, aspectRatio, (err, oferta) => {
						res.json({error_code:0, err_desc: null, data: oferta});
					})
				} else {
					res.json(err);
				}
			})
		})

	})

});

//post /ofertas/nueva - recive todos los datos del producto, guarda nuevo producto en la bdd
router.post('/nuevo', (req, res) => {

	let dataOferta = {
		titulo: req.body.titulo,
		descripcion: req.body.descripcion,
		fecha: req.body.fecha,
		producto: req.body.producto,
		condiciones: req.body.condiciones,
		edades: req.body.edades,
		sexo: req.body.sexo,
		etiquetas: req.body.etiquetas

	};
	ofertasManager.newBargain(dataOferta, (err, oferta) => {
		if (err){
			res.status(500).json(err)
		} else {
			res.json(oferta);
		}
	})

})

export default router
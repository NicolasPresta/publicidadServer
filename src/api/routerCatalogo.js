/**
 * Created by Artiom on 21/04/2016.
 */
import express from 'express'
import catalogoManager from '../lib/catalogoManager'
import imagesManager from '../lib/imagesManager'
import Log from 'log'
import appConfig from '../config/config'
import fs from 'fs-extra'
import multer from 'multer'

import path from 'path'

const log = new Log(appConfig.LogLevel)
const router = express.Router();

const CONFIG_IMAGENES = {
	PRE_PROCESS: './uploads/process/productos/',
	READY: './uploads/ready/productos/',
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
}).single('producto');

//get /productos/ - devuelve todos los productos
router.get('/', (req, res) => {
	let param = req.query;
	Object.keys(param).forEach(function(key, index){
		param[key] = {
			$regex: param[key],
			$options: 'i'
		}
	});
	console.log(param);
	catalogoManager.getAll(param, (err, sucursales) => {
		if (err){
			res.status(500).json(err)
		} else {
			res.json(sucursales)
		}
	})

})

//get /productos/imagen/:id - recive id de producto, devuelve imagen
router.get('/imagen/:id', (req, res) => {
	let idProducto = req.params.id;
	let tamaño = req.query.size || 'large';
	log.debug('Piden la imagen del producto ' + idProducto);
	catalogoManager.getImageById(idProducto, (err, doc) => {
		console.log(err);

		log.debug('la imagen es ' + doc);
		if (err){
			console.log('hola, tenemos un error ' + err);
			res.status(500).json(err)
		} else if (doc.imagen){
			fs.readFile(path.join(CONFIG_IMAGENES.READY, idProducto + '-' + tamaño + '.' + doc.imagen.extension), (err, imagen) => {
				res.set('Content-Type', doc.imagen.mimetype);
				res.send(imagen);
			})

		}
	})
})

//post /productos/nueva/imagen/:id - se sube la imagen del producto
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
					catalogoManager.saveImage(req.params.id, req.file.mimetype, imageExt, aspectRatio, (err, producto) => {
						res.json({error_code:0, err_desc: null, data: producto});
					})
				} else {
					res.json(err);
				}
			})
		})

	})

});

//post /producto/nuevo - recive todos los datos del producto, guarda nuevo producto en la bdd
router.post('/nuevo', (req, res) => {

	let dataProducto = {
		nombre: req.body.nombre,
		descripcion: req.body.descripcion,
		codigo: req.body.codigo,
		precio: {
			valor: req.body.precio,
			moneda: '$'
		},
		sucursales: req.body.sucursales,
		etiquetas: req.body.etiquetas,
		destacar: req.body.destacar

	};
	catalogoManager.newProduct(dataProducto, (err, producto) => {
		if (err){
			res.status(500).json(err)
		} else {
			res.json(producto);
		}
	})

})

export default router
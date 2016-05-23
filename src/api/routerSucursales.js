/**
 * Created by Artiom on 04/04/2016.
 */
import express from 'express'
import sucursalesManager from '../lib/sucursalesManager'
import imagesManager from '../lib/imagesManager'
import Log from 'log'
import appConfig from '../config/config'
import fs from 'fs-extra'
import multer from 'multer'

import path from 'path'

const log = new Log(appConfig.LogLevel)
const router = express.Router();



const CONFIG_IMAGENES = {
	PRE_PROCESS: './uploads/process/sucursales/',
	READY: './uploads/ready/sucursales/',
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
}).single('sucursal');

//get /sucursales/ - devuelve todas las sucursales
router.get('/', (req, res) => {
	let param = req.query;
	Object.keys(param).forEach(function(key, index){
		param[key] = {
			$regex: param[key],
			$options: 'i'
		}
	});
	console.log(param);
	sucursalesManager.getAll(param, (err, sucursales) => {
		console.log(sucursales);
		if (err){
			res.status(500).json(err)
		} else {
			res.json(sucursales)
		}
	})

})

//get /sucursales/imagen:id - recive id de sucursal, devuelve imagen de la sucursal
router.get('/imagen/:id', (req, res) => {
	let idSucursal = req.params.id;
	let tamaño = req.query.size || 'large';
	log.debug('Piden la imagen de la sucursal ' + idSucursal);
	sucursalesManager.getImageById(idSucursal, (err, doc) => {
		log.debug('la imagen es ' + doc);
		if (err){
			res.status(500).json(err)
		} else if (doc.imagen){
			fs.readFile(path.join(CONFIG_IMAGENES.READY, idSucursal + '-' + tamaño + '.' + doc.imagen.extension), (err, imagen) => {
				res.set('Content-Type', doc.imagen.mimetype);
				res.send(imagen);
			})

		}
	})
})

//post /sucursales/nueva/imagen/:id - se sube la imagen de la sucursal
router.post('/nueva/imagen/:id', (req, res) => {
	upload(req, res, function(err){
		console.log(req.file);
		if (err){
			res.json({error_code:1, err_desc:err});
			return;
		}
		let imageExt = req.file.originalname.split('.')[req.file.originalname.split('.').length-1];
		imagesManager.getImageSize(CONFIG_IMAGENES, req.params.id, imageExt, (size) => {
			var aspectRatio = size.width / size.height;
			imagesManager.processImage(CONFIG_IMAGENES, req.params.id, imageExt, (err, results) => {
				if (!err){
					sucursalesManager.saveImage(req.params.id, req.file.mimetype, imageExt, aspectRatio, (err, sucursal) => {
						res.json({error_code:0, err_desc: null, data: sucursal});
					})
				} else {
					res.json(err);
				}
			});
		})

	})

});

//post /sucursales/nueva - recive todos los datos de la sucursal, guarda nueva sucursal en la bdd
router.post('/nueva', (req, res) => {

	let horaDesde = new Date(req.body.horario.desde);
	let horaHasta = new Date(req.body.horario.hasta);

	let dataSucursal = {
		nombre: req.body.nombre,
		direccion: req.body.direccion,
		ubicacion: {
			latitud: req.body.ubicacion.latitud,
			longitud: req.body.ubicacion.longitud
		},
		localidad: req.body.localidad,
		provincia: req.body.provincia,
		pais: req.body.pais,
		horario: {
			desde: horaDesde.getHours() * 60 + horaDesde.getMinutes(),
			hasta: horaHasta.getHours() * 60 + horaHasta.getMinutes()
		}
	};
	sucursalesManager.newSubsidiary(dataSucursal, (err, sucursal) => {
		if (err){
			console.log(err);
			res.status(500).json(err)
		} else {
			res.json(sucursal);
		}
	})

})

export default router
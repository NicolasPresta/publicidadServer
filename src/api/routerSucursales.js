/**
 * Created by Artiom on 04/04/2016.
 */
import express from 'express'
import sucursalesManager from '../lib/sucursalesManager'
import Log from 'log'
import appConfig from '../config/config'
import fs from 'fs-extra'
import multer from 'multer'

import gm from 'gm'
import path from 'path'

import async from 'async'

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

	sucursalesManager.getAll((err, sucursales) => {
		if (err){
			res.sendStatus(500).json(err)
		} else {
			res.json(sucursales)
		}
	})

})

const getImageSize = function(idImagen, extension, callback){
	gm(path.join(CONFIG_IMAGENES.PRE_PROCESS, idImagen + '.' + extension))
		.size((err, size) => {
			callback(size)
		})
}

const saveProccesedImage = function(idImagen, extension, imagenSize, callback){
	gm(path.join(CONFIG_IMAGENES.PRE_PROCESS, idImagen + '.' + extension))
		.resize(imagenSize.WIDTH)
		.autoOrient()
		.write(path.join(CONFIG_IMAGENES.READY, idImagen + '-' + imagenSize.DESC + '.' + extension), (err) => {
			//TODO chequear manejo de errores por si falla la escritura de la imagen en el fileSystem
			if (!err) {
				console.log('no hay error, llamamos al callback');
				callback(null, imagenSize.DESC);
			} else {
				callback(err);
			}
		})
}

const processImage = function(idImagen, extension, mainCallback){
	console.log('procesamos la imagen');
	//Sincronizo el procesamiento de las 3 imágenes y sólo cuando las 3 se hayan guardado continúo y le respondo al usuario
	async.parallel({
		small: function(callback){
			let imagenSize = CONFIG_IMAGENES.SIZES[0]
			saveProccesedImage(idImagen, extension, imagenSize, callback)
		},
		medium: function(callback){
			let imagenSize = CONFIG_IMAGENES.SIZES[1]
			saveProccesedImage(idImagen, extension, imagenSize, callback)
		},
		large: function(callback){
			let imagenSize = CONFIG_IMAGENES.SIZES[2]
			saveProccesedImage(idImagen, extension, imagenSize, callback)
		}
	}, function(err, results){
		console.log('terminamos con las 3, creo...');
		//Una vez procesadas las 3 imagenes, borro la original e informo al usuario
		if (!err){
			fs.unlink(path.join(CONFIG_IMAGENES.PRE_PROCESS, idImagen + '.' + extension), (err) => {
				console.log('borramos la original');
				if (!err){
					console.log('no tenemos error, maincallback');
					mainCallback(null, results)
				} else {
					mainCallback(err)
				}
			})
		} else {
			mainCallback(err)
		}
	})
}

//get /sucursales/imagen:id - recive id de sucursal, devuelve imagen de la sucursal
router.get('/imagen/:id', (req, res) => {
	let idSucursal = req.params.id;
	let tamaño = req.query.size || 'large';
	log.debug('Piden la imagen de la sucursal ' + idSucursal);
	sucursalesManager.getImageById(idSucursal, (err, doc) => {
		log.debug('la imagen es ' + doc);
		if (err){
			console.log('hola, tenemos un error ' + err);
			res.sendStatus(500).json(err)
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
		getImageSize(req.params.id, imageExt, (size) => {
			var aspectRatio = size.width / size.height;
			processImage(req.params.id, imageExt, (err, results) => {
				if (!err){
					console.log(aspectRatio);
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
			res.sendStatus(500).json(err)
		} else {
			res.json(sucursal);
		}
	})

})

export default router
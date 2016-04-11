/**
 * Created by Artiom on 04/04/2016.
 */
import express from 'express'
import sucursalesManager from '../lib/sucursalesManager'
import Log from 'log'
import appConfig from '../config/config'
import fs from 'fs-extra'
import multer from 'multer'

const log = new Log(appConfig.LogLevel)
const router = express.Router();

import gm from 'gm'
import path from 'path'

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

const fileFilter = function(req, file, cb) {
	let type = file.mimetype;
	if (type == 'image/jpeg' || type == 'image/png'){
		cb(null, true);
	} else {
		cb(null, false);
	}
}

const upload = multer({
	storage: storage,
	fileFilter: fileFilter
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

const processImage = function(idImagen, extension){
	CONFIG_IMAGENES.SIZES.forEach((imagenSize) => {
		gm(path.join(CONFIG_IMAGENES.PRE_PROCESS, idImagen + '.' + extension))
			.resize(imagenSize.WIDTH)
			.autoOrient()
			.write(path.join(CONFIG_IMAGENES.READY, idImagen + '-' + imagenSize.DESC + '.' + extension), (err) => {
				//TODO chequear manejo de errores por si falla la escritura de la imagen en el fileSystem
				if (!err) {
					console.log('hecho')
				} else {
					console.log(err)
				}
			})
	})
}

//get /sucursales/imagen:id - recive id de sucursal, devuelve imagen de la sucursal
router.get('/imagen/:id', (req, res) => {
	//TODO devolver imagen con el tamaño requerido
	let idSucursal = req.params.id;
	let tamaño = req.query.size || 'large';
	log.debug('Piden la imagen de la sucursal ' + idSucursal);
	sucursalesManager.getImageById(idSucursal, (err, doc) => {
		log.debug('la imagen es ' + doc);
		if (err){
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
	//TODO verificar que el archivo a subir sea una imagen
	upload(req, res, function(err){
		if (err){
			res.json({error_code:1, err_desc:err});
			return;
		}
		var imageExt = req.file.originalname.split('.')[req.file.originalname.split('.').length-1];
		processImage(req.params.id, imageExt);
		sucursalesManager.saveImage(req.params.id, req.file.mimetype, imageExt, (err, sucursal) => {
			res.json({error_code:0, err_desc: null, data: sucursal});
		})

	})

});

//post /sucursales/nueva - recive todos los datos de la sucursal, guarda nueva sucursal en la bdd
router.post('/nueva', (req, res) => {

	let dataSucursal = {
		nombre: req.body.nombre,
		descripcion: req.body.descripcion,
		direccion: req.body.direccion,
		ubicacion: {
			latitud: req.body.ubicacion.latitud,
			longitud: req.body.ubicacion.longitud
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
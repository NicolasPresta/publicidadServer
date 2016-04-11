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

const storage = multer.diskStorage({
	destination: function(req, file, cb){
		console.log(req.params);
		cb(null, './src/uploads/sucursales/')
	},
	filename: function(req, file, cb){
		console.log(req.params);
		//var datetimestamp = Date.now();
		cb(null, file.fieldname + '-' + req.params.id + '.' + file.originalname.split('.')[file.originalname.split('.').length-1])
	}
});

const upload = multer({
	storage: storage
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

//get /sucursales/imagen:id - recive id de sucursal, devuelve imagen de la sucursal
router.get('/imagen/:id', (req, res) => {
	//TODO devolver imagen con el tamaño requerido
	let idSucursal = req.params.id;
	//let tamaño = req.query.size;
	log.debug('Piden la imagen de la sucursal ' + idSucursal);
	sucursalesManager.getImageById(idSucursal, (err, doc) => {
		log.debug('la imagen es ' + doc);
		if (err){
			res.sendStatus(500).json(err)
		} else {
			fs.readFile(doc.imagen, (err, imagen) => {
				res.set('Content-Type', 'image/jpeg');
				res.send(imagen);
			})

		}
	})
})

//post /sucursales/nueva/imagen/:id - se sube la imagen de la sucursal
router.post('/nueva/imagen/:id', (req, res) => {
	//TODO verificar que el archivo a subir sea una imagen
	upload(req, res, function(err){
		console.log(req.params);
		console.log(req.headers);
		console.log(req.body);
		console.log(req.file);
		console.log(req.files);
		if (err){
			res.json({error_code:1, err_desc:err});
			return;
		}
		sucursalesManager.saveImage(req.params.id, req.file.path, (err, sucursal) => {
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
			res.sendStatus(500).json(err)
		} else {
			res.json(sucursal);
		}
	})

})

export default router
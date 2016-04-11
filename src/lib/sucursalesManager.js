/**
 * Created by Artiom on 01/04/2016.
 */

//Conexión con la base de datos para cargar las sucursales y también recibir la información

import sucursal from '../models/sucursales';
import fs from 'fs';
const RUTA_IMAGENES = 'C:\\img\\sucursales\\';

var sucursalesManager = {

	//devuelve todas las sucursales
	getAll: function(callback){
		sucursal.find({}, 'nombre descripcion direccion ubicacion', callback)
	},
	//Devuelve la imagen de una sucursal por su id
	getImageById: function(id, callback){
		sucursal.findById(id, 'imagen', callback)
	},
	//Devuelve sucursal por su id
	getById: function(id, callback){
		sucursal.findById(id, 'nombre descripcion direccion ubicacion', callback)
	},
	newSubsidiary: function(dataSucursal, callback){
		let nuevaSucursal = new sucursal({
			nombre: dataSucursal.nombre,
			descripcion: dataSucursal.descripcion,
			direccion: dataSucursal.direccion,
			ubicacion: dataSucursal.ubicacion
		})
		nuevaSucursal.save(callback)
	},
	saveImage: function(id, rutaImagen, callback){
		console.log('guardar imagen en el id: ' + id);
		console.log('la ruta de la imagen es: ' + rutaImagen);
		sucursal.findById(id, 'imagen', (err, doc) => {
			console.log('el documento encontrado es: ' + doc);
			doc.imagen = rutaImagen;
			doc.save(callback);
		})
	}

};

export default sucursalesManager;
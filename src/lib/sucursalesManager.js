/**
 * Created by Artiom on 01/04/2016.
 */

//Conexión con la base de datos para cargar las sucursales y también recibir la información

import sucursal from '../models/sucursales';

var sucursalesManager = {

	//devuelve todas las sucursales
	getAll: function(param, callback){
		sucursal.find(param, 'nombre direccion ubicacion imagen localidad provincia pais telefonos horario', callback)
	},
	//Devuelve la imagen de una sucursal por su id
	getImageById: function(id, callback){
		sucursal.findById(id, 'imagen', callback)
	},
	//Devuelve sucursal por su id
	getById: function(id, callback){
		sucursal.findById(id, 'nombre direccion ubicacion imagen localidad provincia pais telefonos horario', callback)
	},
	newSubsidiary: function(dataSucursal, callback){
		let nuevaSucursal = new sucursal({
			nombre: dataSucursal.nombre,
			direccion: dataSucursal.direccion,
			ubicacion: dataSucursal.ubicacion,
			localidad: dataSucursal.localidad,
			provincia: dataSucursal.provincia,
			pais: dataSucursal.pais,
			telefonos: dataSucursal.telefonos,
			horario: dataSucursal.horario
			//radioEnvio: dataSucursal.radioEnvio
		})
		nuevaSucursal.save(callback)
	},
	saveImage: function(id, mimeType, extension, aspectRatio, callback){
		sucursal.findById(id, 'imagen', (err, doc) => {
			doc.imagen.ready = true;
			doc.imagen.contentType = mimeType;
			doc.imagen.extension = extension;
			doc.imagen.aspectRatio = aspectRatio;
			doc.save(callback);
		})
	}

};

export default sucursalesManager;
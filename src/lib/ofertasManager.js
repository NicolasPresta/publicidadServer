/**
 * Created by Artiom on 27/05/2016.
 */
/**
 * Created by Artiom on 21/04/2016.
 */

import oferta from '../models/ofertas'

var ofertasManager = {

	//Devuelve el catalogo entero
	getAll: function(param, callback){
		oferta.find(param, 'titulo descripcion fecha condiciones edades sexo sucursales etiquetas', callback);
	},
	//Devuelve la imagen por el id
	getImageById: function(idOferta, callback){
		console.log(idOferta);
		oferta.findById(idOferta, 'imagen', callback);
	},
	//Crear un nuevo oferta
	newBargain: function(dataOferta, callback){
		let nuevaOferta = new oferta({
			nombre: dataOferta.nombre,
			descripcion: dataOferta.descripcion,
			codigo: dataOferta.codigo,
			precio: dataOferta.precio,
			sucursales: dataOferta.sucursales,
			etiquetas: dataOferta.etiquetas,
			destacar: dataOferta.destacar
		})
		nuevaOferta.save(callback)
	},
	//Guarda los datos de la imagen de un oferta
	saveImage: function(id, mimeType, extension, aspectRatio, callback){
		oferta.findById(id, 'imagen', (err, doc) => {
			doc.imagen.ready = true;
			doc.imagen.contentType = mimeType;
			doc.imagen.extension = extension;
			doc.imagen.aspectRatio = aspectRatio;
			doc.save(callback);
		})
	}

}

export default ofertasManager
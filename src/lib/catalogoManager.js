/**
 * Created by Artiom on 21/04/2016.
 */

import producto from '../models/catalogos'

var catalogoManager = {

	//Devuelve el catalogo entero
	getAll: function(callback){
		producto.find({}, 'nombre descripcion codigo precio sucursales etiquetas destacar', callback);
	},
	//Devuelve la imagen por el id
	getImageById: function(idProducto, callback){
		producto.findById(idProducto, 'imagen', callback);
	},
	//Crear un nuevo producto
	newProduct: function(dataProducto, callback){
		let nuevoProducto = new producto({
			nombre: dataProducto.nombre,
			descripcion: dataProducto.descripcion,
			codigo: dataProducto.codigo,
			precio: dataProducto.precio,
			sucursales: dataProducto.sucursales,
			etiquetas: dataProducto.etiquetas,
			destacar: dataProducto.destacar
		})
		nuevoProducto.save(callback)
	},
	//Guarda los datos de la imagen de un producto
	saveImage: function(id, mimeType, extension, aspectRatio, callback){
		producto.findById(id, 'imagen', (err, doc) => {
			doc.imagen.ready = true;
			doc.imagen.contentType = mimeType;
			doc.imagen.extension = extension;
			doc.imagen.aspectRatio = aspectRatio;
			doc.save(callback);
		})
	}

}

export default catalogoManager
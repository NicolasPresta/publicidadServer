/**
 * Created by Artiom on 30/03/2016.
 */
import mongoose from 'mongoose'

const catalogo = mongoose.Schema({
	nombre: String,
	description: String,
	precio: String,
	sucursales: [String],
	etiquetas: [String],
	destacar: Number, //Destacado por prioridad
	imagen: {
		data: Buffer,
		contentType: String
	}
});

export default mongoose.model('catalogo', catalogo);
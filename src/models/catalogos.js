/**
 * Created by Artiom on 30/03/2016.
 */
import mongoose from 'mongoose'

const producto = mongoose.Schema({
	nombre: String,
	descripcion: String,
	codigo: String,
	precio: String,
	sucursales: [String],
	etiquetas: [String],
	destacar: Number, //Destacado por prioridad
	imagen: {
		ready: {type: Boolean, default: false},
		contentType: String,
		extension: String,
		aspectRatio: Number
	}
});

export default mongoose.model('producto', producto);
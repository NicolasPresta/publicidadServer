/**
 * Created by Artiom on 30/03/2016.
 */
import mongoose from 'mongoose'

const sucursal = mongoose.Schema({
	nombre: String,
	direccion: String,
	ubicacion: {
		latitud: Number,
		longitud: Number
	},
	imagen: {
		ready: {type: Boolean, default: false},
		contentType: String,
		extension: String,
		aspectRatio: Number
	},
	localidad: String,
	provincia: String,
	pais: String,
	telefonos: [String],
	horario: {
		desde: Number,
		hasta: Number
	},
	radioEnvio: String
});

export default mongoose.model('sucursales', sucursal);
/**
 * Created by Artiom on 30/03/2016.
 */
import mongoose from 'mongoose'

const sucursal = mongoose.Schema({
	nombre: String,
	descripcion: String,
	direccion: String,
	imagen: {
		ready: {type: Boolean, default: false},
		contentType: String,
		extension: String
	},
	ubicacion: {
		latitud: Number,
		longitud: Number
	}
});

export default mongoose.model('sucursales', sucursal);
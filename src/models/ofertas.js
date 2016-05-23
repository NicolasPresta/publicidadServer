/**
 * Created by Artiom on 11/05/2016.
 */

import mongoose from 'mongoose'

const oferta = mongoose.Schema({
	titulo: String,
	descripcion: String,
	fecha: {
		desde: Date,
		hasta: Date
	},
	producto: String,
	condiciones: String,
	edades: {
		desde: Number,
		hasta: Number
	},
	sexo: String,
	sucursales: [String],
	etiquetas: [String],
	imagen: {
		ready: {type: Boolean, default: false},
		contentType: String,
		extension: String,
		aspectRatio: Number
	}
});

export default mongoose.model('oferta', oferta);
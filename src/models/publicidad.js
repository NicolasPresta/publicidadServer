/**
 * Created by Artiom on 03/04/2016.
 */
import mongoose from 'mongoose'

const publicidad = mongoose.Schema({
	titulo: String,
	descripcion: String,
	imagen: {
		data: Buffer,
		contentType: String
	},
	vigenciaDesde: Date,
	vigenciaHasta: Date,
	sucursales: [String],
	edadDesde: Number,
	edadHasta: Number,
	sexo: String,
	ubicaciones: [String],
	condiciones: String,
	etiquetas: [String],
	productos: [String]
});

export default mongoose.model('publicidades', publicidad);
/**
 * Created by Artiom on 03/04/2016.
 */
import mongoose from 'mongoose'

const promocion = mongoose.Schema({
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
	productos: [String],
	codigo: String,
	cantidad: Number,
	dispositivos: [String],
	restantes: Number
});

export default mongoose.model('promociones', promocion);
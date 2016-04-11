/**
 * Created by Artiom on 03/04/2016.
 */
import mongoose from 'mongoose'

const etiqueta = mongoose.Schema({
	nombre: String,
	imagen: {
		data: Buffer,
		contentType: String
	}
});

export default mongoose.model('etiquetas', etiqueta);
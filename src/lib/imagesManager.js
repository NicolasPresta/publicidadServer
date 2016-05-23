/**
 * Created by Artiom on 04/05/2016.
 */
import fs from 'fs-extra'
import gm from 'gm'
import path from 'path'
import async from 'async'

var imagesManager = {
	saveProccesedImage: function(config, idImagen, extension, imagenSize, callback){
		gm(path.join(config.PRE_PROCESS, idImagen + '.' + extension))
			.resize(imagenSize.WIDTH)
			.autoOrient()
			.write(path.join(config.READY, idImagen + '-' + imagenSize.DESC + '.' + extension), (err) => {
				//TODO chequear manejo de errores por si falla la escritura de la imagen en el fileSystem
				if (!err) {
					callback(null, imagenSize.DESC);
				} else {
					callback(err);
				}
			})
	},
	processImage: function(config, idImagen, extension, mainCallback){
		//Sincronizo el procesamiento de las 3 imágenes y sólo cuando las 3 se hayan guardado continúo y le respondo al usuario
		async.parallel({
			small: function(callback){
				let imagenSize = config.SIZES[0]
				imagesManager.saveProccesedImage(config, idImagen, extension, imagenSize, callback)
			},
			medium: function(callback){
				let imagenSize = config.SIZES[1]
				imagesManager.saveProccesedImage(config, idImagen, extension, imagenSize, callback)
			},
			large: function(callback){
				let imagenSize = config.SIZES[2]
				imagesManager.saveProccesedImage(config, idImagen, extension, imagenSize, callback)
			}
		}, function(err, results){
			//Una vez procesadas las 3 imagenes, borro la original e informo al usuario
			if (!err){
				fs.unlink(path.join(config.PRE_PROCESS, idImagen + '.' + extension), (err) => {
					if (!err){
						mainCallback(null, results)
					} else {
						mainCallback(err)
					}
				})
			} else {
				mainCallback(err)
			}
		})
	},
	getImageSize: function(config, idImagen, extension, callback){
		gm(path.join(config.PRE_PROCESS, idImagen + '.' + extension))
			.size((err, size) => {
				callback(size)
			})
	}
}

export default imagesManager

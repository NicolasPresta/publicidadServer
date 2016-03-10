"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
// Este manager tiene que hacer las consultas a la base de datos para obtener las publicidades

var dummy = [{
	titulo: "Una super oferta",
	descripcion: "tv 42 pulgadas a solo $10000",
	img: "http://production-alkosto-data.s3-website-us-east-1.amazonaws.com/media/catalog/product/cache/6/image/69ace863370f34bdf190e4e164b6e123/t/v/tv-42-led-lg-42ln5700-fhd-int-5.jpg",
	vigenciaDesde: "09/03/2016",
	vigenciaHasta: "30/03/2016",
	condiciones: "solo si tenes familia en la antartida"
}, {
	titulo: "Ahora más barato!",
	descripcion: "juego de living 3 piezas",
	img: "http://mueblerialaeconomia.net/img/productos/juego_de_living_lore.jpg",
	vigenciaDesde: "01/03/2016",
	vigenciaHasta: "15/03/2016",
	condiciones: "no incluye los sillones"
}];

var publicidadManager = {

	getAll: function getAll(callback) {

		var error = null;
		var publicidades = dummy;

		callback(error, publicidades);
	}

};

exports.default = publicidadManager;
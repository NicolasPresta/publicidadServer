// Este manager tiene que hacer las consultas a la base de datos para obtener las publicidades

var dummy = { publicidades:

	[	
		{	
			titulo:"Una super oferta",
			descripcion:"TV 42 pulgadas a solo $10000",
			img: "http://cdn.arstechnica.net/wp-content/uploads/2012/09/steambigpic.png",
			vigenciaDesde: "09/03/2016",
			vigenciaHasta: "30/03/2016",
			condiciones: "solo si tenes familia en la antartida"
		},
		{
			titulo:"Ahora más barato!",
			descripcion:"juego de living 3 piezas",
			img: "http://mueblerialaeconomia.net/img/productos/juego_de_living_lore.jpg",
			vigenciaDesde: "01/03/2016",
			vigenciaHasta: "15/03/2016",
			condiciones: "no incluye los sillones"
		},
		{
			titulo:"Pecas en oferta",
			descripcion:"Solo por hoy",
			img: "http://www.ellashoy.com/images/pecas-en-la-cara.jpg",
			vigenciaDesde: "01/03/2016",
			vigenciaHasta: "15/03/2016",
			condiciones: "no incluye los sillones"
		},
		{
			titulo:"Regalo del día del perro",
			descripcion:"Aprovecha y poné contento al boby",
			img: "http://img.mundoperros.es/wp-content/uploads/2012/02/perros1.jpeg",
			vigenciaDesde: "01/03/2016",
			vigenciaHasta: "15/03/2016",
			condiciones: "no incluye los sillones"
		},
		{
			titulo:"El living de un rey",
			descripcion:"Stock re limitado",
			img: "http://rossidisegno.com/objects/wp-content/uploads/2013/07/A_MesaRatonaBodega_E0000.jpg",
			vigenciaDesde: "01/03/2016",
			vigenciaHasta: "15/03/2016",
			condiciones: "no incluye los sillones"
		},
		{
			titulo:"Encontrá el look para el otoño",
			descripcion:"Vas a quedar hermosa y otoñal",
			img: "http://i2.wp.com/www.fabricastextiles.com.ar/wp-content/uploads/2014/04/fabrica-de-camperas-de-cuero.jpg",
			vigenciaDesde: "01/03/2016",
			vigenciaHasta: "15/03/2016",
			condiciones: "no incluye los sillones"
		},
		{
			titulo:"La mejor promoción en lentes",
			descripcion:"Los que usá el diego",
			img: "http://www.opticapaesani.com.ar/media/catalog/product/cache/8/image/9df78eab33525d08d6e5fb8d27136e95/t/h/the_guardian_opaco.jpg",
			vigenciaDesde: "01/03/2016",
			vigenciaHasta: "15/03/2016",
			condiciones: "no incluye los sillones"
		},
		{
			titulo:"Pizzara para los más chicos",
			descripcion:"Aprenden jugando y es barato",
			img: "http://static.imujer.com/sites/default/files/lasmanualidades/pizarra.jpg",
			vigenciaDesde: "01/03/2016",
			vigenciaHasta: "15/03/2016",
			condiciones: "no incluye los sillones"
		}
	]
}

var publicidadManager = {

	getAll: function(callback){

		var error = null
		var publicidades = dummy

		callback(error, publicidades)
	}

}

export default publicidadManager

// Este manager tiene que hacer las consultas a la base de datos para obtener las publicidades

var dummy = { publicidades:

	[	
		{	
			id: 1,
			titulo:"Una super oferta",
			descripcion:"TV 42 pulgadas a solo $10000",
			img: "http://cdn.arstechnica.net/wp-content/uploads/2012/09/steambigpic.png",
			vigenciaDesde: "09/03/2016",
			vigenciaHasta: "30/03/2016",
			condiciones: "Condiciones: solo si tenes familia en la antartida, previa comprobacion del parentesco familiar aca voy a poner un texto absurdamente largo soo para verificar que se envie bien los datos y lueg los pueda leeer pq sino es una cagada, tengo que escribir mucho mucho para que aparesca mucho mucho texto en el celular y ver que pasa, si el scroll funciona o no.  Ojala que funcione, dios quiera que funcione, sino es una cagada.  espero que todo este texto sirva, sino voy a tener que vlver para  escribir mas :("
		},
		{
			id: 2,
			titulo:"Ahora más barato!",
			descripcion:"juego de living 3 piezas",
			img: "http://mueblerialaeconomia.net/img/productos/juego_de_living_lore.jpg",
			vigenciaDesde: "01/03/2016",
			vigenciaHasta: "15/03/2016",
			condiciones: "Condiciones: no valido para el interior del pais. Stock de 4000 unidades."
		},
		{
			id: 3,
			titulo:"Pecas en oferta",
			descripcion:"Solo por hoy",
			img: "http://www.ellashoy.com/images/pecas-en-la-cara.jpg",
			vigenciaDesde: "01/03/2016",
			vigenciaHasta: "12/04/2016",
			condiciones: "Condiciones: Solo en efectivo. No incluye las pecas."
		},
		{
			id: 4,
			titulo:"Regalo del día del perro",
			descripcion:"Aprovecha y poné contento al boby",
			img: "http://img.mundoperros.es/wp-content/uploads/2012/02/perros1.jpeg",
			vigenciaDesde: "01/03/2016",
			vigenciaHasta: "29/05/2016",
			condiciones: "Condiciones: no valido en el extrajero, solo previo deposito bancario. Consultar por tarjetas habilitadas"
		},
		{
			id: 5,
			titulo:"El living de un rey",
			descripcion:"Stock re limitado",
			img: "http://rossidisegno.com/objects/wp-content/uploads/2013/07/A_MesaRatonaBodega_E0000.jpg",
			vigenciaDesde: "01/03/2016",
			vigenciaHasta: "18/04/2016",
			condiciones: "Condiciones: solo para jubilados y pensionados."
		},
		{
			id: 6,
			titulo:"Encontrá el look para el otoño",
			descripcion:"Vas a quedar hermosa y otoñal",
			img: "http://i2.wp.com/www.fabricastextiles.com.ar/wp-content/uploads/2014/04/fabrica-de-camperas-de-cuero.jpg",
			vigenciaDesde: "01/03/2016",
			vigenciaHasta: "30/06/2016",
			condiciones: "Condiciones: para compras por internet de 22:03 a 22:05."
		},
		{
			id: 7,
			titulo:"La mejor promoción en lentes",
			descripcion:"Los que usá el diego",
			img: "http://www.opticapaesani.com.ar/media/catalog/product/cache/8/image/9df78eab33525d08d6e5fb8d27136e95/t/h/the_guardian_opaco.jpg",
			vigenciaDesde: "01/03/2016",
			vigenciaHasta: "19/03/2016",
			condiciones: "Condiciones: No incluye costos de envios."
		},
		{
			id: 8,
			titulo:"Pizzara para los más chicos",
			descripcion:"Aprenden jugando y es barato",
			img: "http://static.imujer.com/sites/default/files/lasmanualidades/pizarra.jpg",
			vigenciaDesde: "01/03/2016",
			vigenciaHasta: "17/03/2016",
			condiciones: "Condiciones: Las tizas se venden por separado por un valor de $80 la unidad. Compra minima 8 tizas."
		}
	]
}

var publicidadManager = {

	getAll: function(callback){

		var error = null
		var publicidades = dummy

		callback(error, publicidades)
	},

	getById: function(id, callback){

		var error = null
		var publicidades = dummy

		var encontrado = publicidades.publicidades.find((element, index, array) => {
				return (element.id == id)
			})

		var publicidad = { publicidad: encontrado }

		callback(error, publicidad)
	}

}

export default publicidadManager

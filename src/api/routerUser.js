/**
 * Created by Artiom on 04/04/2016.
 */
import express from 'express'
import Log from 'log'
import appConfig from '../config/config'
import jwt from 'jsonwebtoken'

const log = new Log(appConfig.LogLevel)
const router = express.Router();

//post /user/login - Inicio de sesion verifica usuario contra bd y genera token
router.post('/login', (req, res) => {
	//TODO validar usuario contra bd ?
	if (req.body.name == appConfig.global_user.name && req.body.password == appConfig.global_user.password){
		res.json(jwt.sign(req.body, appConfig.app_secret, {expiresIn: "1d"}));
	} else {
		res.sendStatus(403);
	}

});

//post /user/phoneData - Recibe los datos de un dispositivo y los almacena
router.post('/phoneData', (req, res) => {

	var uuid = req.body.uuid;
	var DeviceId = req.body.DeviceId;
	var SubscriberId = req.body.SubscriberId;
	var SimSerialNumber = req.body.SimSerialNumber;
	var Line1Number = req.body.Line1Number;
	var NetworkCountryIso = req.body.NetworkCountryIso;
	var NetworkOperatorName = req.body.NetworkOperatorName;
	var MANUFACTURER = req.body.MANUFACTURER;
	var MODEL = req.body.MODEL;
	var SDK_INT = req.body.SDK_INT;


	log.debug("nuevo request de /phoneData " + uuid + " - " +
		DeviceId + " - " +
		SubscriberId + " - " +
		SimSerialNumber + " - " +
		Line1Number + " - " +
		NetworkCountryIso + " - " +
		NetworkOperatorName + " - " +
		MANUFACTURER + " - " +
		MODEL + " - " +
		SDK_INT)

	res.sendStatus(200);
});

//post /user/userData - Recibe los datos de un usuario de dispositivo y los almacena
router.post('/userData', (req, res) => {

	var uuid = req.body.uuid;
	var Sexo = req.body.Sexo;
	var FechaNacimiento = req.body.FechaNacimiento;
	var Cuentas = req.body.Cuentas;

	log.debug("nuevo request de /userData " + uuid + " - " +
		Sexo + " - " +
		FechaNacimiento + " - " +
		Cuentas )

	res.sendStatus(200);
});

//post /user/gpsData - Recibe los datos de ubicaciones de un dispositivo y los almacena
router.post('/gpsData', (req, res) => {

	var uuid = req.body.uuid;
	var ubicaciones = JSON.stringify(req.body.Ubicaciones);


	log.debug("nuevo request de /gpsData " + uuid + " - " +
		ubicaciones )

	res.sendStatus(200);
});

export default router
const express = require('express');
const router = express.Router();
// Los .. son para acceder y volver a la carpeta controllers
const actController = require('../controllers/actController');

// Ruta para guardar
router.post('/actividad', actController.registrarActividad);

// Ruta para leer
router.get('/actividad', actController.consultarActividades);

// Ruta para actualizar el estado de una actividad usando su ID
router.put('/actividad/:id', actController.actualizarEstadoActividad);

module.exports = router;
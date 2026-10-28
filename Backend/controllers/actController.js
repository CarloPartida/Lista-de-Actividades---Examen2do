const actModel = require('../models/actModel');

async function registrarActividad(req, res) {
    // Son los datos que pedimos en la función.
    try {
        const nombre = req.body.nombre || '';
        const descripcion = req.body.descripcion || '';
        const estado = req.body.estado || 'Pendiente';

        // Estas son las validaciones donde validamos si un dato ingresado está en blanco
        if (
            typeof nombre !== 'string' || !nombre.trim() ||
            typeof descripcion !== 'string' || !descripcion.trim()
        ) {
            return res.status(400).send('Datos de la actividad son inválidos');
        }

        // Mandamos los datos limpios al modelo
        const id = await actModel.registrarActividad(
            nombre.trim(),
            descripcion.trim(),
            estado.trim()
        );

        // Respondemos al frontend que todo salió bien
        res.json({ mensaje: 'Actividad guardada', id: id });
    } catch (error) {
        console.error('Error al registrar la actividad:', error);
        res.status(500).send('Error al guardar la actividad');
    }
}

async function consultarActividades(req, res) {
    try {
        // Pedimos todas las tareas a la lista enlazada
        const actividades = await actModel.obtenerTodas();
        res.json(actividades);
    } catch (error) {
        res.status(500).send('Error al consultar');
    }
}

async function actualizarEstadoActividad(req, res) {
    try {
        const id = req.params.id; // Obtenemos el ID desde la URL
        const nuevoEstado = req.body.estado; // Obtenemos el nuevo estado

        const actualizada = await actModel.actualizarEstado(id, nuevoEstado);

        if (!actualizada) {
            return res.status(404).send('Actividad no encontrada');
        }

        res.json({ mensaje: 'Estado actualizado con éxito', actividad: actualizada });
    } catch (error) {
        console.error('Error al actualizar:', error);
        res.status(500).send('Error al actualizar el estado');
    }
}

module.exports = {
    registrarActividad,
    consultarActividades,
    actualizarEstadoActividad
};
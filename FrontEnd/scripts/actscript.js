// Seleccionamos los elementos de nuestro HTML para poder controlarlos con código
const formulario = document.getElementById('formulario-actividad');
const contenedorLista = document.getElementById('lista-actividades');

// Función que pide las actividades al servidor backend y las dibuja en la pantalla
async function cargarActividades() {
    try {
        const respuesta = await fetch('/actividad');
        const actividades = await respuesta.json();

        contenedorLista.innerHTML = '';

        actividades.forEach(act => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-actividad';
            
            // Agregamos un botoncito en cada tarjeta para cambiar su estado
            tarjeta.innerHTML = `
                <h3>${act.nombre}</h3>
                <p><strong>Descripción:</strong> ${act.descripcion}</p>
                <p><strong>Estado:</strong> ${act.estado}</p>
                <button onclick="cambiarEstado(${act.id})" style="background-color: #ffc107; color: black; padding: 5px 10px; width: auto;">Cambiar Estado</button>
            `;
            
            contenedorLista.appendChild(tarjeta);
        });
    } catch (error) {
        console.error('Error al cargar las actividades:', error);
    }
}

// Nueva función para solicitar el cambio de estado
async function cambiarEstado(id) {
    // Abrimos una ventana emergente para preguntar el nuevo estado
    const nuevoEstado = prompt("Escribe el nuevo estado (Pendiente, En Proceso, Completada):");
    
    if (nuevoEstado) {
        try {
            await fetch(`/actividad/${id}`, {
                method: 'PUT', // Método PUT para actualizar
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: nuevoEstado })
            });
            
            cargarActividades(); // Recargamos la lista para ver el cambio reflejado
        } catch (error) {
            console.error('Error al actualizar el estado:', error);
        }
    }
}

// Evento que se dispara al presionar el botón de "Guardar Actividad"
formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault(); // Evitamos que la página parpadee o se recargue por defecto

    // Recolectamos lo que el usuario escribió en las cajas de texto del HTML
    const nuevaActividad = {
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        estado: document.getElementById('estado').value
    };

    try {
        // Enviamos los datos al backend usando el método POST
        await fetch('/actividad', {
            method: 'POST', // Le decimos que queremos guardar un dato nuevo
            headers: { 'Content-Type': 'application/json' }, // Avisamos que el contenido es JSON
            body: JSON.stringify(nuevaActividad) // Convertimos nuestro objeto a texto para viajar por red
        });

        formulario.reset(); // Vaciamos las cajas de texto para la siguiente captura
        cargarActividades(); // Volvemos a pedir la lista al servidor para ver la nueva tarea
    } catch (error) {
        console.error('Error al guardar la actividad:', error);
    }
});

// Cuando la página se abre por primera vez, ejecutamos esta función de inmediato
cargarActividades();
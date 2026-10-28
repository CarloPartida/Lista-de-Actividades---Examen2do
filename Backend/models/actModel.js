const fs = require('fs');
const path = require('path');

// Definimos la ruta exacta donde se creará y guardará nuestro tareas.txt
const archivoRuta = path.join(__dirname, 'tareas.txt');

// Representa un elemento individual en nuestra lista
class Nodo {
    constructor(id, nombre, descripcion, estado) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.estado = estado;
        this.siguiente = null; // Apunta al siguiente, empieza vacío
    }
}

// Nuestra estructura de datos para guardar todo
class ListaEnlazada {
    constructor() {
        this.cabeza = null; // Inicio de la lista
        this.contadorId = 1; // Generamos un ID autoincrementable
        this.cargarDesdeArchivo(); // Al iniciar, leemos el archivo.txt si ya tiene datos
    }

    // Función para leer el archivo.txt y reconstruir la lista enlazada en memoria
    cargarDesdeArchivo() {
        try {
            // Verificamos si el archivo físico ya existe en la computadora
            if (fs.existsSync(archivoRuta)) {
                const contenido = fs.readFileSync(archivoRuta, 'utf8');
                if (contenido.trim() !== '') {
                    const datos = JSON.parse(contenido); // Convertimos el texto a arreglo
                    
                    // Reconstruimos la lista enlazada nodo por nodo
                    datos.forEach(item => {
                        this.agregarDirecto(item.id, item.nombre, item.descripcion, item.estado);
                        // Ajustamos el contador para que el siguiente ID sea único
                        if (item.id >= this.contadorId) {
                            this.contadorId = item.id + 1;
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error al leer el archivo:', error);
        }
    }

    // Función auxiliar para agregar nodos al cargar el archivo sin alterar contadores
    agregarDirecto(id, nombre, descripcion, estado) {
        const nuevoNodo = new Nodo(id, nombre, descripcion, estado);
        if (!this.cabeza) {
            this.cabeza = nuevoNodo;
        } else {
            let actual = this.cabeza;
            while (actual.siguiente) {
                actual = actual.siguiente;
            }
            actual.siguiente = nuevoNodo;
        }
    }

    // Función que recorre la lista enlazada y la guarda completa en archivo.txt
    guardarEnArchivo() {
        try {
            const arreglo = [];
            let actual = this.cabeza;
            
            while (actual) {
                arreglo.push({
                    id: actual.id,
                    nombre: actual.nombre,
                    descripcion: actual.descripcion,
                    estado: actual.estado
                });
                actual = actual.siguiente;
            }
            
            // Escribimos el arreglo convertido a texto plano en archivo.txt
            fs.writeFileSync(archivoRuta, JSON.stringify(arreglo, null, 2), 'utf8');
        } catch (error) {
            console.error('Error al guardar en el archivo:', error);
        }
    }

    async registrarActividad(nombre, descripcion, estado) {
        const nuevoNodo = new Nodo(this.contadorId++, nombre, descripcion, estado);
        
        // Hacemos el insert de los datos en la lista
        if (!this.cabeza) {
            this.cabeza = nuevoNodo;
        } else {
            let actual = this.cabeza;
            while (actual.siguiente) {
                actual = actual.siguiente; // Recorremos hasta el último
            }
            actual.siguiente = nuevoNodo; // Lo pegamos al final
        }
        
        this.guardarEnArchivo(); // Guardamos los cambios físicamente en el txt
        return nuevoNodo.id; // Retornamos el ID
    }

    async obtenerTodas() {
        const arreglo = [];
        let actual = this.cabeza;
        
        // Recorremos la lista para convertirla en arreglo y mandarla al frontend
        while (actual) {
            arreglo.push({
                id: actual.id,
                nombre: actual.nombre,
                descripcion: actual.descripcion,
                estado: actual.estado
            });
            actual = actual.siguiente;
        }
        return arreglo;
    }

    async actualizarEstado(id, nuevoEstado) {
        let actual = this.cabeza;
        
        while (actual) {
            if (actual.id === parseInt(id)) {
                actual.estado = nuevoEstado; // Actualizamos el estado en la lista
                this.guardarEnArchivo(); // Guardamos los cambios en el archivo.txt
                return actual;
            }
            actual = actual.siguiente;
        }
        return null;
    }
}

// Inicializamos la lista para usarla
const lista = new ListaEnlazada();

// Exportamos las funciones
module.exports = {
    registrarActividad: (nombre, desc, est) => lista.registrarActividad(nombre, desc, est),
    obtenerTodas: () => lista.obtenerTodas(),
    actualizarEstado: (id, est) => lista.actualizarEstado(id, est)
};
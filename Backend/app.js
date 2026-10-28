const express = require("express"); // Importa la dependencia express
const path = require("path"); // Para que trabaje con los archivos y carpetas de mi PC

const actRoutes = require('./routes/actRoute'); // Le pasamos el enrutador de actividades

const app = express();

// Permite que el servidor lea datos enviados en JSON o desde formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Que tome los archivos de FrontEnd usando dirname
app.use(express.static(path.join(__dirname, '../FrontEnd')));

// Cuando entren a la ruta principal, mandamos el HTML de tu vista
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../FrontEnd/index/act.html'));
});

// Le decimos que use las rutas que programamos
app.use(actRoutes);

// Le decimos que se ejecute en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); 
const app = express();

app.use(bodyParser.json());
app.use(cors());

// Servir archivos estáticos (HTML, CSS, JS) desde la carpeta 'form'
app.use(express.static(path.join(__dirname))); // Asegúrate de servir la carpeta actual

// Conectar a la base de datos SQLite
const db = new sqlite3.Database(path.join(__dirname, 'tareas.db'), (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos SQLite.');
  }
});

// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    materia TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    completada INTEGER DEFAULT 0
  )`, (err) => {
    if (err) {
      console.error('Error al crear la tabla:', err.message);
    } else {
      console.log('Tabla "tareas" creada o ya existe.');
    }
  });

// Agregar tarea
app.post('/tareas', (req, res) => {
    const { nombre, materia, descripcion } = req.body; // Obtener todos los campos
    const query = `INSERT INTO tareas (nombre, materia, descripcion) VALUES (?, ?, ?)`;
    db.run(query, [nombre, materia, descripcion], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, nombre, materia, descripcion, completada: 0 });
    });
});

// Obtener tareas
app.get('/tareas', (req, res) => {
  const query = `SELECT * FROM tareas`;
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ tareas: rows });
  });
});

// Eliminar tarea
app.delete('/tareas/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM tareas WHERE id = ?`;
  db.run(query, id, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Tarea eliminada correctamente' });
  });
});

// Ruta para servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

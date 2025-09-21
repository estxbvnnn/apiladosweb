require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/apilados');

// Asegurar que la carpeta uploads exista antes de que multer intente escribir
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// servir imágenes (usar ruta absoluta creada arriba)
app.use('/uploads', express.static(uploadsDir));

// rutas
app.use('/api/libros', require('./routes/libroRoutes'));

app.listen(PORT, () => console.log(`Servidor corriendo en ${PORT}`));

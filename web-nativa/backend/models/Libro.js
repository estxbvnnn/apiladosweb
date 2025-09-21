const mongoose = require('mongoose');

const LibroSchema = new mongoose.Schema({
  ISBN: { type: String, required: true, unique: true },
  nombreLibro: { type: String, required: true },
  autor: { type: String, required: true },
  editorial: { type: String, required: true },
  portada: { type: String }, // ruta relativa a /uploads
  paginas: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Libro', LibroSchema);

const Libro = require('../models/Libro');
const fs = require('fs');
const path = require('path');

const getAll = async (req, res) => {
  try {
    const libros = await Libro.find().sort({ createdAt: -1 });
    res.json(libros);
  } catch (err) {
    res.status(500).json({ message: 'Error en servidor' });
  }
};

const getLast3 = async (req, res) => {
  try {
    const libros = await Libro.find().sort({ createdAt: -1 }).limit(3);
    res.json(libros);
  } catch (err) {
    res.status(500).json({ message: 'Error en servidor' });
  }
};

const getById = async (req, res) => {
  try {
    const libro = await Libro.findById(req.params.id);
    if (!libro) return res.status(404).json({ message: 'No encontrado' });
    res.json(libro);
  } catch (err) {
    res.status(500).json({ message: 'Error en servidor' });
  }
};

const create = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.portada = '/uploads/' + req.file.filename;
    const libro = new Libro(data);
    await libro.save();
    res.status(201).json(libro);
  } catch (err) {
    console.error('Error en create libro:', err);
    // Manejo de error de clave duplicada (ISBN único)
    if (err.code === 11000) {
      return res.status(400).json({ message: 'ISBN duplicado. Ya existe un libro con ese ISBN.' });
    }
    // Mongoose validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Error en servidor al crear libro.' });
  }
};

const update = async (req, res) => {
  try {
    const libro = await Libro.findById(req.params.id);
    if (!libro) return res.status(404).json({ message: 'No encontrado' });

    // si suben nueva imagen, eliminar anterior
    if (req.file) {
      if (libro.portada) {
        // quitar slash inicial para no convertir la ruta en absoluta en path.join
        const rel = libro.portada.replace(/^\/+/, '');
        const oldPath = path.join(__dirname, '..', rel);
        if (fs.existsSync(oldPath)) {
          fs.unlink(oldPath, (e) => { /* ignoramos errores al borrar */ });
        }
      }
      req.body.portada = '/uploads/' + req.file.filename;
    }

    Object.assign(libro, req.body);
    await libro.save();
    res.json(libro);
  } catch (err) {
    console.error('Error en update libro:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'ISBN duplicado. Ya existe un libro con ese ISBN.' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Error en servidor al actualizar libro.' });
  }
};

const remove = async (req, res) => {
  try {
    const libro = await Libro.findByIdAndDelete(req.params.id);
    if (!libro) return res.status(404).json({ message: 'No encontrado' });
    if (libro.portada) {
      const rel = libro.portada.replace(/^\/+/, '');
      const oldPath = path.join(__dirname, '..', rel);
      if (fs.existsSync(oldPath)) {
        fs.unlink(oldPath, (e) => { /* ignoramos errores al borrar */ });
      }
    }
    res.json({ message: 'Eliminado' });
  } catch (err) {
    console.error('Error en remove libro:', err);
    res.status(500).json({ message: 'Error en servidor' });
  }
};

const search = async (req, res) => {
  try {
    const q = req.query.q || '';
    const regex = new RegExp(q, 'i');
    const results = await Libro.find({
      $or: [
        { nombreLibro: regex },
        { autor: regex },
        { editorial: regex }
      ]
    }).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Error en servidor' });
  }
};

module.exports = { getAll, getLast3, getById, create, update, remove, search };

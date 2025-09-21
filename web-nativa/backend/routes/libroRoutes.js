const express = require('express');
const router = express.Router();
const controller = require('../controllers/libroController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { libroValidationRules, validate } = require('../middleware/validateLibro');

// asegurar carpeta uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// configuración multer usando ruta absoluta
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // limpiar nombre para evitar problemas
    const cleanName = file.originalname.replace(/\s+/g, '_');
    cb(null, unique + '-' + cleanName);
  }
});
const upload = multer({ storage });

// rutas
router.get('/', controller.getAll);
router.get('/last3', controller.getLast3);
router.get('/search', controller.search);
router.get('/:id', controller.getById);
router.post('/', upload.single('portada'), libroValidationRules, validate, controller.create);
router.put('/:id', upload.single('portada'), libroValidationRules, validate, controller.update);
router.delete('/:id', controller.remove);

module.exports = router;

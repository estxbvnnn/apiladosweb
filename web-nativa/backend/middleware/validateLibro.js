const { body, validationResult } = require('express-validator');

const libroValidationRules = [
  body('ISBN').isString().notEmpty().withMessage('ISBN requerido'),
  body('nombreLibro').isString().notEmpty().withMessage('Nombre requerido'),
  body('autor').isString().notEmpty().withMessage('Autor requerido'),
  body('editorial').isString().notEmpty().withMessage('Editorial requerida'),
  body('paginas').isInt({ min: 1 }).withMessage('Páginas debe ser número positivo')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

module.exports = { libroValidationRules, validate };

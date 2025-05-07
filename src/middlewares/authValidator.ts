import { body } from 'express-validator';

export const registerValidator = [
  body('username')
    .trim()
    .notEmpty().withMessage('El usuario es requerido')
    .isLength({ min: 3 }).withMessage('El usuario debe tener al menos 3 caracteres'),
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Email inválido'),
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

export const loginValidator = [
  body('username')
    .trim()
    .notEmpty().withMessage('El usuario es requerido'),
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
];

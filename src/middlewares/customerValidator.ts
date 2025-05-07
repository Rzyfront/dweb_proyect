import { body, param } from 'express-validator';

export const createCustomerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Email inválido'),
  body('phone')
    .optional()
    .isString().withMessage('El teléfono debe ser un texto'),
  body('identityDocument')
    .optional()
    .isString().withMessage('El documento de identidad debe ser un texto'),
  body('nationality')
    .optional()
    .isString().withMessage('La nacionalidad debe ser un texto')
];

export const updateCustomerValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID inválido'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Email inválido'),
  body('phone')
    .optional()
    .isString().withMessage('El teléfono debe ser un texto'),
  body('identityDocument')
    .optional()
    .isString().withMessage('El documento de identidad debe ser un texto'),
  body('nationality')
    .optional()
    .isString().withMessage('La nacionalidad debe ser un texto')
];

export const getCustomerByIdValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID inválido')
];

export const deleteCustomerValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID inválido')
];

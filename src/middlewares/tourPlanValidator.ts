import { body, param } from 'express-validator';

export const createTourPlanValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  body('price')
    .notEmpty().withMessage('El precio es requerido')
    .isNumeric().withMessage('El precio debe ser numérico'),
  body('description')
    .optional()
    .isString().withMessage('La descripción debe ser un texto'),
  body('totalDuration')
    .optional()
    .isInt({ min: 1 }).withMessage('La duración debe ser un número entero positivo')
];

export const updateTourPlanValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID inválido'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  body('price')
    .optional()
    .isNumeric().withMessage('El precio debe ser numérico'),
  body('description')
    .optional()
    .isString().withMessage('La descripción debe ser un texto'),
  body('totalDuration')
    .optional()
    .isInt({ min: 1 }).withMessage('La duración debe ser un número entero positivo')
];

export const getTourPlanByIdValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID inválido')
];

export const deleteTourPlanValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID inválido')
];

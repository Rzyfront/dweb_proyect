import { body, param } from 'express-validator';

export const createTouristSiteValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  body('siteType')
    .notEmpty().withMessage('El tipo de sitio es requerido')
    .isIn(['natural', 'cultural', 'other']).withMessage('Tipo de sitio inválido'),
  body('location')
    .optional()
    .isString().withMessage('La ubicación debe ser un texto'),
  body('description')
    .optional()
    .isString().withMessage('La descripción debe ser un texto')
];

export const updateTouristSiteValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID inválido'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  body('siteType')
    .optional()
    .isIn(['natural', 'cultural', 'other']).withMessage('Tipo de sitio inválido'),
  body('location')
    .optional()
    .isString().withMessage('La ubicación debe ser un texto'),
  body('description')
    .optional()
    .isString().withMessage('La descripción debe ser un texto')
];

export const getTouristSiteByIdValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID inválido')
];

export const deleteTouristSiteValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID inválido')
];

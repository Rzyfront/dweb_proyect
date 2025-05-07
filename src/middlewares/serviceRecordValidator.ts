import { body, param } from 'express-validator';

export const createServiceRecordValidator = [
  body('tourRequestId')
    .notEmpty().withMessage('El ID de la solicitud de tour es requerido')
    .isInt({ min: 1 }).withMessage('El ID de la solicitud de tour debe ser un número entero positivo'),
  body('status')
    .notEmpty().withMessage('El estado es requerido')
    .isIn(['confirmed', 'cancelled', 'completed']).withMessage('Estado inválido'),
  body('recordDate')
    .notEmpty().withMessage('La fecha de registro es requerida')
    .isISO8601().withMessage('La fecha de registro debe ser una fecha válida'),
  body('comments')
    .optional()
    .isString().withMessage('Los comentarios deben ser un texto')
];

export const updateServiceRecordValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID inválido'),
  body('tourRequestId')
    .optional()
    .isInt({ min: 1 }).withMessage('El ID de la solicitud de tour debe ser un número entero positivo'),
  body('status')
    .optional()
    .isIn(['confirmed', 'cancelled', 'completed']).withMessage('Estado inválido'),
  body('recordDate')
    .optional()
    .isISO8601().withMessage('La fecha de registro debe ser una fecha válida'),
  body('comments')
    .optional()
    .isString().withMessage('Los comentarios deben ser un texto')
];

export const getServiceRecordByIdValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID inválido')
];

export const deleteServiceRecordValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID inválido')
];

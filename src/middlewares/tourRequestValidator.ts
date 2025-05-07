import { body, param } from 'express-validator';

export const createTourRequestValidator = [
  body('customerId')
    .notEmpty().withMessage('El ID del cliente es requerido')
    .isInt({ min: 1 }).withMessage('El ID del cliente debe ser un número entero positivo'),
  body('tourPlanId')
    .notEmpty().withMessage('El ID del plan de tour es requerido')
    .isInt({ min: 1 }).withMessage('El ID del plan de tour debe ser un número entero positivo'),
  body('requestDate')
    .notEmpty().withMessage('La fecha de solicitud es requerida')
    .isISO8601().withMessage('La fecha de solicitud debe ser una fecha válida'),
  body('tourDate')
    .notEmpty().withMessage('La fecha del tour es requerida')
    .isISO8601().withMessage('La fecha del tour debe ser una fecha válida'),
  body('peopleCount')
    .notEmpty().withMessage('El número de personas es requerido')
    .isInt({ min: 1 }).withMessage('El número de personas debe ser un número entero positivo'),
  body('notes')
    .optional()
    .isString().withMessage('Las notas deben ser un texto')
];

export const updateTourRequestValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID inválido'),
  body('customerId')
    .optional()
    .isInt({ min: 1 }).withMessage('El ID del cliente debe ser un número entero positivo'),
  body('tourPlanId')
    .optional()
    .isInt({ min: 1 }).withMessage('El ID del plan de tour debe ser un número entero positivo'),
  body('requestDate')
    .optional()
    .isISO8601().withMessage('La fecha de solicitud debe ser una fecha válida'),
  body('tourDate')
    .optional()
    .isISO8601().withMessage('La fecha del tour debe ser una fecha válida'),
  body('peopleCount')
    .optional()
    .isInt({ min: 1 }).withMessage('El número de personas debe ser un número entero positivo'),
  body('notes')
    .optional()
    .isString().withMessage('Las notas deben ser un texto')
];

export const getTourRequestByIdValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID inválido')
];

export const deleteTourRequestValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID inválido')
];

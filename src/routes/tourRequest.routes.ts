import { Router } from 'express';
import {
  getAllTourRequests,
  getTourRequestById,
  createTourRequest,
  updateTourRequest,
  deleteTourRequest
} from '../controllers/tourRequest.controller';
import {
  createTourRequestValidator,
  updateTourRequestValidator,
  getTourRequestByIdValidator,
  deleteTourRequestValidator
} from '../middlewares/tourRequestValidator';
import { authMiddleware } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate';

const router = Router();

// Todas las rutas de tour requests requieren autenticación
router.get('/', authMiddleware, getAllTourRequests);
router.get('/:id', authMiddleware, getTourRequestByIdValidator, validate, getTourRequestById);
router.post('/', authMiddleware, createTourRequestValidator, validate, createTourRequest);
router.put('/:id', authMiddleware, updateTourRequestValidator, validate, updateTourRequest);
router.delete('/:id', authMiddleware, deleteTourRequestValidator, validate, deleteTourRequest);

export default router;

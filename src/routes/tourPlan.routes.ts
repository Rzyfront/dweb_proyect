import { Router } from 'express';
import {
  getAllTourPlans,
  getTourPlanById,
  createTourPlan,
  updateTourPlan,
  deleteTourPlan
} from '../controllers/tourPlan.controller';
import {
  createTourPlanValidator,
  updateTourPlanValidator,
  getTourPlanByIdValidator,
  deleteTourPlanValidator
} from '../middlewares/tourPlanValidator';
import { authMiddleware } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate';

const router = Router();

// Todas las rutas de tour plans requieren autenticación
router.get('/', authMiddleware, getAllTourPlans);
router.get('/:id', authMiddleware, getTourPlanByIdValidator, validate, getTourPlanById);
router.post('/', authMiddleware, createTourPlanValidator, validate, createTourPlan);
router.put('/:id', authMiddleware, updateTourPlanValidator, validate, updateTourPlan);
router.delete('/:id', authMiddleware, deleteTourPlanValidator, validate, deleteTourPlan);

export default router;

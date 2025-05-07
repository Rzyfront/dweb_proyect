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
import validate from '../middlewares/validate';

const router = Router();

router.get('/', getAllTourPlans);
router.get('/:id', getTourPlanByIdValidator, validate, getTourPlanById);
router.post('/', createTourPlanValidator, validate, createTourPlan);
router.put('/:id', updateTourPlanValidator, validate, updateTourPlan);
router.delete('/:id', deleteTourPlanValidator, validate, deleteTourPlan);

export default router;

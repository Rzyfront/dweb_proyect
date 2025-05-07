import { Router } from 'express';
import {
  getAllTourPlans,
  getTourPlanById,
  createTourPlan,
  updateTourPlan,
  deleteTourPlan
} from '../controllers/tourPlan.controller';

const router = Router();

router.get('/', getAllTourPlans);
router.get('/:id', getTourPlanById);
router.post('/', createTourPlan);
router.put('/:id', updateTourPlan);
router.delete('/:id', deleteTourPlan);

export default router;

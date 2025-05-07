import { Router } from 'express';
import {
  getAllTourRequests,
  getTourRequestById,
  createTourRequest,
  updateTourRequest,
  deleteTourRequest
} from '../controllers/tourRequest.controller';

const router = Router();

router.get('/', getAllTourRequests);
router.get('/:id', getTourRequestById);
router.post('/', createTourRequest);
router.put('/:id', updateTourRequest);
router.delete('/:id', deleteTourRequest);

export default router;

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
import validate from '../middlewares/validate';

const router = Router();

router.get('/', getAllTourRequests);
router.get('/:id', getTourRequestByIdValidator, validate, getTourRequestById);
router.post('/', createTourRequestValidator, validate, createTourRequest);
router.put('/:id', updateTourRequestValidator, validate, updateTourRequest);
router.delete('/:id', deleteTourRequestValidator, validate, deleteTourRequest);

export default router;

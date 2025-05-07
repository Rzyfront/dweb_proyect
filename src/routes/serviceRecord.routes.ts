import { Router } from 'express';
import {
  getAllServiceRecords,
  getServiceRecordById,
  createServiceRecord,
  updateServiceRecord,
  deleteServiceRecord
} from '../controllers/serviceRecord.controller';
import {
  createServiceRecordValidator,
  updateServiceRecordValidator,
  getServiceRecordByIdValidator,
  deleteServiceRecordValidator
} from '../middlewares/serviceRecordValidator';
import validate from '../middlewares/validate';

const router = Router();

router.get('/', getAllServiceRecords);
router.get('/:id', getServiceRecordByIdValidator, validate, getServiceRecordById);
router.post('/', createServiceRecordValidator, validate, createServiceRecord);
router.put('/:id', updateServiceRecordValidator, validate, updateServiceRecord);
router.delete('/:id', deleteServiceRecordValidator, validate, deleteServiceRecord);

export default router;

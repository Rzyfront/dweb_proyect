import { Router } from 'express';
import {
  getAllServiceRecords,
  getServiceRecordById,
  createServiceRecord,
  updateServiceRecord,
  deleteServiceRecord
} from '../controllers/serviceRecord.controller';

const router = Router();

router.get('/', getAllServiceRecords);
router.get('/:id', getServiceRecordById);
router.post('/', createServiceRecord);
router.put('/:id', updateServiceRecord);
router.delete('/:id', deleteServiceRecord);

export default router;

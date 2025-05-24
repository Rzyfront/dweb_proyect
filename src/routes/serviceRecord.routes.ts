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
import { authMiddleware } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate';

const router = Router();

// Todas las rutas de service records requieren autenticación
router.get('/', authMiddleware, getAllServiceRecords);
router.get('/:id', authMiddleware, getServiceRecordByIdValidator, validate, getServiceRecordById);
router.post('/', authMiddleware, createServiceRecordValidator, validate, createServiceRecord);
router.put('/:id', authMiddleware, updateServiceRecordValidator, validate, updateServiceRecord);
router.delete('/:id', authMiddleware, deleteServiceRecordValidator, validate, deleteServiceRecord);

export default router;

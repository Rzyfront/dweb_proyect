import { Router } from 'express';
import { getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customer.controller';
import { createCustomerValidator, updateCustomerValidator, getCustomerByIdValidator, deleteCustomerValidator } from '../middlewares/customerValidator';
import { authMiddleware } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate';

const router = Router();

// Todas las rutas de customer requieren autenticación y autorización
router.get('/', 
  authMiddleware,
  getAllCustomers
);

router.get('/:id', 
  authMiddleware,
  getCustomerByIdValidator, 
  validate, 
  getCustomerById
);

router.post('/', 
  authMiddleware,
  createCustomerValidator, 
  validate, 
  createCustomer
);

router.put('/:id', 
  authMiddleware,
  updateCustomerValidator, 
  validate, 
  updateCustomer
);

router.delete('/:id', 
  authMiddleware,
  deleteCustomerValidator, 
  validate, 
  deleteCustomer
);

export default router;
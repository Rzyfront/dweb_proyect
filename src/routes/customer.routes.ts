import { Router } from 'express';
import { getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customer.controller';
import { createCustomerValidator, updateCustomerValidator, getCustomerByIdValidator, deleteCustomerValidator } from '../middlewares/customerValidator';
import validate from '../middlewares/validate';

const router = Router();

router.get('/', getAllCustomers);
router.get('/:id', getCustomerByIdValidator, validate, getCustomerById);
router.post('/', createCustomerValidator, validate, createCustomer);
router.put('/:id', updateCustomerValidator, validate, updateCustomer);
router.delete('/:id', deleteCustomerValidator, validate, deleteCustomer);

export default router;
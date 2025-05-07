import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { registerValidator, loginValidator } from '../middlewares/authValidator';
import validate from '../middlewares/validate'; 
const router = Router();

// Evita el error de overload matches usando rutas exactas
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate,  login);

export default router;
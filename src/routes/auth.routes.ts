import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import validate from '../middlewares/validate';

const router = Router();

// Evita el error de overload matches usando rutas exactas
router.post('/register', register);
router.post('/login', login);

export default router;
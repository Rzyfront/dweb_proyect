import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import validate from '../middlewares/validate';

const router = Router();

router.post('/register', validate, register);
router.post('/login', validate, login);

export default router;
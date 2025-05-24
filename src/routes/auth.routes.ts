import { Router, Request, Response, NextFunction } from 'express';
import authController from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { registerValidator, loginValidator } from '../middlewares/authValidator';
import validate from '../middlewares/validate';

const router = Router();

// Rutas públicas de autenticación (no requieren autenticación)
router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);

// Rutas protegidas (requieren autenticación y autorización)
router.post('/logout', 
  authMiddleware,
  authController.logout
);

// Ruta protegida para obtener perfil
router.get('/profile', 
  authMiddleware,
  authController.getProfile
);

export default router;
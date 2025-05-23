import { Router } from 'express';
import { register, login, refreshToken, logout } from '../controllers/auth.controller'; // Ajusta la ruta
import { authMiddleware } from '../middlewares/auth.middleware'; // Ajusta la ruta
// import { validate } from '../middlewares/validate'; // Si tienes validaciones específicas
// import { registerValidator, loginValidator } from '../middlewares/authValidator'; // Si tienes validaciones

const router = Router();

// Rutas de autenticación
router.post('/register', /* registerValidator, validate, */ register);
router.post('/login',    /* loginValidator, validate, */ login);
router.post('/refresh-token', refreshToken);
router.post('/logout', authMiddleware, logout); // Logout requiere que el usuario esté autenticado para invalidar su refresh token

// Ejemplo de ruta protegida
router.get('/profile', authMiddleware, (req, res) => {
  // req.user está disponible aquí gracias a authMiddleware
  if (req.user) {
    res.json({
      message: 'This is a protected profile route',
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        roles: req.user.roles?.map(r => r.name)
      }
    });
  } else {
    res.status(401).json({ message: 'User not available in request' });
  }
});

export default router;
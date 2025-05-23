import { Router, Request, Response, NextFunction } from 'express'; // Asegúrate de importar Request, Response, NextFunction
import authController from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import Role from '../models/auth/Role'; // Importa Role para tipar 'r'

const router = Router();

// Rutas de autenticación
router.post('/register', authController.register);
router.post('/login', authController.login);

// La función refreshToken no está definida como método en la clase AuthController.
// router.post('/refresh-token', authController.refreshToken); 

router.post('/logout', 
  authMiddleware, 
  authController.logout
);

// Ejemplo de ruta protegida
router.get('/profile', 
  authMiddleware, 
  (req: Request, res: Response) => {
    if (req.user) {
      res.json({
        message: 'This is a protected profile route',
        user: {
          id: req.user.id,
          username: req.user.username,
          email: req.user.email,
          roles: req.user.roles?.map((r: Role) => r.name) // Tipar 'r' como Role
        }
      });
    } else {
      res.status(401).json({ message: 'User not available in request' });
    }
});

export default router;
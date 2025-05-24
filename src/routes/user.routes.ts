import { Router } from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/user.controller';
// import { authMiddleware } from '../middlewares/auth.middleware'; // Comentado para quitar auth

const router = Router();

// Middleware de autenticación REMOVIDO - Acceso libre a todas las rutas de usuarios
// router.use(authMiddleware);

// CRUD para Usuarios (SIN AUTENTICACIÓN)
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);


// router.post('/login', loginUser);
// router.post('/register', registerUser);
// router.post('/logout', logoutUser);
// router.post('/forgot-password', forgotPassword);


export default router;
import { Router } from 'express';
import roleController from '../controllers/role.controller';
// import { authMiddleware } from '../middlewares/auth.middleware'; // Comentado para quitar auth

const router = Router();

// Middleware de autenticación REMOVIDO - Acceso libre a todas las rutas de roles
// router.use(authMiddleware);

// CRUD para Roles (SIN AUTENTICACIÓN)
router.post('/', roleController.createRole);
router.get('/', roleController.getAllRoles);
router.get('/:id', roleController.getRoleById);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

// Asignar y remover roles de usuarios (SIN AUTENTICACIÓN)
router.post('/assign', roleController.assignRoleToUser);
router.post('/remove', roleController.removeRoleFromUser);

export default router;

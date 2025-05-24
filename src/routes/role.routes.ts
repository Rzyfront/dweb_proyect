import { Router } from 'express';
import roleController from '../controllers/role.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Middleware de autenticación para todas las rutas de roles
router.use(authMiddleware);

// CRUD para Roles
router.post('/', roleController.createRole);
router.get('/', roleController.getAllRoles);
router.get('/:id', roleController.getRoleById);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

// Asignar y remover roles de usuarios
router.post('/assign', roleController.assignRoleToUser);
router.post('/remove', roleController.removeRoleFromUser);

export default router;

import { Router } from 'express';
import roleController from '../controllers/role.controller';
import { authMiddleware, authorizeMiddleware } from '../middlewares/auth.middleware';
import { HttpMethod } from '../types/auth.types';

const router = Router();

// Middleware de autenticación para todas las rutas de roles
router.use(authMiddleware);

// CRUD para Roles
// Para crear un rol, se podría requerir un permiso específico, ej: 'MANAGE_ROLES'
router.post(
  '/',
  authorizeMiddleware('/roles', HttpMethod.POST), // Proteger la creación de roles
  roleController.createRole
);

router.get(
  '/', 
  authorizeMiddleware('/roles', HttpMethod.GET), // Proteger el listado de roles
  roleController.getAllRoles
);

router.get(
  '/:id',
  authorizeMiddleware('/roles/:id', HttpMethod.GET), // Proteger la obtención de un rol
  roleController.getRoleById
);

router.put(
  '/:id',
  authorizeMiddleware('/roles/:id', HttpMethod.PUT), // Proteger la actualización de roles
  roleController.updateRole
);

router.delete(
  '/:id',
  authorizeMiddleware('/roles/:id', HttpMethod.DELETE), // Proteger la eliminación (lógica) de roles
  roleController.deleteRole
);

// Asignar y remover roles de usuarios
router.post(
  '/assign',
  authorizeMiddleware('/roles/assign', HttpMethod.POST), // Proteger la asignación de roles
  roleController.assignRoleToUser
);

router.post(
  '/remove',
  authorizeMiddleware('/roles/remove', HttpMethod.POST), // Proteger la remoción de roles
  roleController.removeRoleFromUser
);

export default router;

import { Router } from 'express';
import resourceController from '../controllers/resource.controller';
import { authMiddleware, authorizeMiddleware } from '../middlewares/auth.middleware';
import { HttpMethod } from '../types/auth.types';

const router = Router();

// Middleware de autenticación para todas las rutas de recursos
router.use(authMiddleware);

// CRUD para Recursos
router.post(
  '/',
  authorizeMiddleware('/resources', HttpMethod.POST), // Proteger la creación de recursos
  resourceController.createResource
);

router.get(
  '/', 
  authorizeMiddleware('/resources', HttpMethod.GET), // Proteger el listado de recursos
  resourceController.getAllResources
);

router.get(
  '/:id',
  authorizeMiddleware('/resources/:id', HttpMethod.GET), // Proteger la obtención de un recurso
  resourceController.getResourceById
);

router.put(
  '/:id',
  authorizeMiddleware('/resources/:id', HttpMethod.PUT), // Proteger la actualización de recursos
  resourceController.updateResource
);

router.delete(
  '/:id',
  authorizeMiddleware('/resources/:id', HttpMethod.DELETE), // Proteger la eliminación (lógica) de recursos
  resourceController.deleteResource
);

// Asignar y remover recursos de roles
router.post(
  '/assign',
  authorizeMiddleware('/resources/assign', HttpMethod.POST), // Proteger la asignación de recursos a roles
  resourceController.assignResourceToRole
);

router.post(
  '/remove',
  authorizeMiddleware('/resources/remove', HttpMethod.POST), // Proteger la remoción de recursos de roles
  resourceController.removeResourceFromRole
);

export default router;

import { Router } from 'express';
import resourceController from '../controllers/resource.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Middleware de autenticación para todas las rutas de recursos
router.use(authMiddleware);

// CRUD para Recursos
router.post('/', resourceController.createResource);
router.get('/', resourceController.getAllResources);
router.get('/:id', resourceController.getResourceById);
router.put('/:id', resourceController.updateResource);
router.delete('/:id', resourceController.deleteResource);

// Asignar y remover recursos de roles
router.post('/assign', resourceController.assignResourceToRole);
router.post('/remove', resourceController.removeResourceFromRole);

export default router;

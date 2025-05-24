import { Router } from 'express';
import resourceController from '../controllers/resource.controller';
// import { authMiddleware } from '../middlewares/auth.middleware'; // Comentado para quitar auth

const router = Router();

// Middleware de autenticación REMOVIDO - Acceso libre a todas las rutas de recursos
// router.use(authMiddleware);

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

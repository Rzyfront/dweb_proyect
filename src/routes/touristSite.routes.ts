import { Router } from 'express';
import {
  getAllTouristSites,
  getTouristSiteById,
  createTouristSite,
  updateTouristSite,
  deleteTouristSite
} from '../controllers/touristSite.controller';
import {
  createTouristSiteValidator,
  updateTouristSiteValidator,
  getTouristSiteByIdValidator,
  deleteTouristSiteValidator
} from '../middlewares/touristSiteValidator';
import { authMiddleware } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate';

const router = Router();

// Todas las rutas de tourist sites requieren autenticación
router.get('/', authMiddleware, getAllTouristSites);
router.get('/:id', authMiddleware, getTouristSiteByIdValidator, validate, getTouristSiteById);
router.post('/', authMiddleware, createTouristSiteValidator, validate, createTouristSite);
router.put('/:id', authMiddleware, updateTouristSiteValidator, validate, updateTouristSite);
router.delete('/:id', authMiddleware, deleteTouristSiteValidator, validate, deleteTouristSite);

export default router;

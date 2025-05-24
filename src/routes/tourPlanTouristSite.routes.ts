import { Router } from 'express';
import {
  getAllTourPlanTouristSites,
  getTourPlanTouristSiteById,
  createTourPlanTouristSite,
  updateTourPlanTouristSite,
  deleteTourPlanTouristSite
} from '../controllers/tourPlanTouristSite.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas de tour plan tourist sites requieren autenticación
router.get('/', authMiddleware, getAllTourPlanTouristSites);
router.get('/:tourPlanId/:touristSiteId', authMiddleware, getTourPlanTouristSiteById);
router.post('/', authMiddleware, createTourPlanTouristSite);
router.put('/:tourPlanId/:touristSiteId', authMiddleware, updateTourPlanTouristSite);
router.delete('/:tourPlanId/:touristSiteId', authMiddleware, deleteTourPlanTouristSite);

export default router;

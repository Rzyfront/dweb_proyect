import { Router } from 'express';
import {
  getAllTourPlanTouristSites,
  getTourPlanTouristSiteById,
  createTourPlanTouristSite,
  updateTourPlanTouristSite,
  deleteTourPlanTouristSite
} from '../controllers/tourPlanTouristSite.controller';

const router = Router();

router.get('/', getAllTourPlanTouristSites);
router.get('/:tourPlanId/:touristSiteId', getTourPlanTouristSiteById);
router.post('/', createTourPlanTouristSite);
router.put('/:tourPlanId/:touristSiteId', updateTourPlanTouristSite);
router.delete('/:tourPlanId/:touristSiteId', deleteTourPlanTouristSite);

export default router;

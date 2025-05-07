import { Router } from 'express';
import {
  getAllTouristSites,
  getTouristSiteById,
  createTouristSite,
  updateTouristSite,
  deleteTouristSite
} from '../controllers/touristSite.controller';

const router = Router();

router.get('/', getAllTouristSites);
router.get('/:id', getTouristSiteById);
router.post('/', createTouristSite);
router.put('/:id', updateTouristSite);
router.delete('/:id', deleteTouristSite);

export default router;

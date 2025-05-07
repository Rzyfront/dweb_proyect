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
import validate from '../middlewares/validate';

const router = Router();

router.get('/', getAllTouristSites);
router.get('/:id', getTouristSiteByIdValidator, validate, getTouristSiteById);
router.post('/', createTouristSiteValidator, validate, createTouristSite);
router.put('/:id', updateTouristSiteValidator, validate, updateTouristSite);
router.delete('/:id', deleteTouristSiteValidator, validate, deleteTouristSite);

export default router;

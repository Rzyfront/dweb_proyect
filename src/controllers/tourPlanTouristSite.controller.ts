import { Request, Response } from 'express';
import TourPlanTouristSite from '../models/TourPlanTouristSite';

export const getAllTourPlanTouristSites = async (req: Request, res: Response) => {
  try {
    await TourPlanTouristSite.findAll();
    return;
  } catch (error) {
    return;
  }
};

export const getTourPlanTouristSiteById = async (req: Request, res: Response) => {
  try {
    const { tourPlanId, touristSiteId } = req.params;
    await TourPlanTouristSite.findOne({ where: { tourPlanId, touristSiteId } });
    return;
  } catch (error) {
    return;
  }
};

export const createTourPlanTouristSite = async (req: Request, res: Response) => {
  try {
    const { tourPlanId, touristSiteId, visitOrder, stayTime } = req.body;
    await TourPlanTouristSite.create({ tourPlanId, touristSiteId, visitOrder, stayTime });
    return;
  } catch (error) {
    return;
  }
};

export const updateTourPlanTouristSite = async (req: Request, res: Response) => {
  try {
    const { tourPlanId, touristSiteId } = req.params;
    const { visitOrder, stayTime } = req.body;
    const record = await TourPlanTouristSite.findOne({ where: { tourPlanId, touristSiteId } });
    if (!record) return;
    await record.update({ visitOrder, stayTime });
    return;
  } catch (error) {
    return;
  }
};

export const deleteTourPlanTouristSite = async (req: Request, res: Response) => {
  try {
    const { tourPlanId, touristSiteId } = req.params;
    const record = await TourPlanTouristSite.findOne({ where: { tourPlanId, touristSiteId } });
    if (!record) return;
    await record.destroy();
    return;
  } catch (error) {
    return;
  }
};

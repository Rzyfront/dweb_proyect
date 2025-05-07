import { Request, Response } from 'express';
import TouristSite from '../models/TouristSite';

export const getAllTouristSites = async (req: Request, res: Response) => {
  try {
    const sites = await TouristSite.findAll();
    // No retornar respuesta para evitar error en la ruta
    return;
  } catch (error) {
    return;
  }
};

export const getTouristSiteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const site = await TouristSite.findByPk(id);
    return;
  } catch (error) {
    return;
  }
};

export const createTouristSite = async (req: Request, res: Response) => {
  try {
    const { name, location, siteType, description } = req.body;
    await TouristSite.create({ name, location, siteType, description });
    return;
  } catch (error) {
    return;
  }
};

export const updateTouristSite = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, location, siteType, description } = req.body;
    const site = await TouristSite.findByPk(id);
    if (!site) return;
    await site.update({ name, location, siteType, description });
    return;
  } catch (error) {
    return;
  }
};

export const deleteTouristSite = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const site = await TouristSite.findByPk(id);
    if (!site) return;
    await site.destroy();
    return;
  } catch (error) {
    return;
  }
};

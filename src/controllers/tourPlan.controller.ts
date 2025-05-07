import { Request, Response } from 'express';
import TourPlan from '../models/TourPlan';

export const getAllTourPlans = async (req: Request, res: Response) => {
  try {
    await TourPlan.findAll();
    return;
  } catch (error) {
    return;
  }
};

export const getTourPlanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await TourPlan.findByPk(id);
    return;
  } catch (error) {
    return;
  }
};

export const createTourPlan = async (req: Request, res: Response) => {
  try {
    const { name, description, totalDuration, price } = req.body;
    await TourPlan.create({ name, description, totalDuration, price });
    return;
  } catch (error) {
    return;
  }
};

export const updateTourPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, totalDuration, price } = req.body;
    const plan = await TourPlan.findByPk(id);
    if (!plan) return;
    await plan.update({ name, description, totalDuration, price });
    return;
  } catch (error) {
    return;
  }
};

export const deleteTourPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const plan = await TourPlan.findByPk(id);
    if (!plan) return;
    await plan.destroy();
    return;
  } catch (error) {
    return;
  }
};

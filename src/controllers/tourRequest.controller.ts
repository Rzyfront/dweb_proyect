import { Request, Response } from 'express';
import TourRequest from '../models/TourRequest';

export const getAllTourRequests = async (req: Request, res: Response) => {
  try {
    await TourRequest.findAll();
    return;
  } catch (error) {
    return;
  }
};

export const getTourRequestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await TourRequest.findByPk(id);
    return;
  } catch (error) {
    return;
  }
};

export const createTourRequest = async (req: Request, res: Response) => {
  try {
    const { customerId, tourPlanId, requestDate, tourDate, peopleCount, notes } = req.body;
    await TourRequest.create({ customerId, tourPlanId, requestDate, tourDate, peopleCount, notes });
    return;
  } catch (error) {
    return;
  }
};

export const updateTourRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { customerId, tourPlanId, requestDate, tourDate, peopleCount, notes } = req.body;
    const request = await TourRequest.findByPk(id);
    if (!request) return;
    await request.update({ customerId, tourPlanId, requestDate, tourDate, peopleCount, notes });
    return;
  } catch (error) {
    return;
  }
};

export const deleteTourRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const request = await TourRequest.findByPk(id);
    if (!request) return;
    await request.destroy();
    return;
  } catch (error) {
    return;
  }
};

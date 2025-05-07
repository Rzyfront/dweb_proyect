import { Request, Response } from 'express';
import ServiceRecord from '../models/ServiceRecord';

export const getAllServiceRecords = async (req: Request, res: Response) => {
  try {
    await ServiceRecord.findAll();
    return;
  } catch (error) {
    return;
  }
};

export const getServiceRecordById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ServiceRecord.findByPk(id);
    return;
  } catch (error) {
    return;
  }
};

export const createServiceRecord = async (req: Request, res: Response) => {
  try {
    const { tourRequestId, status, recordDate, comments } = req.body;
    await ServiceRecord.create({ tourRequestId, status, recordDate, comments });
    return;
  } catch (error) {
    return;
  }
};

export const updateServiceRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tourRequestId, status, recordDate, comments } = req.body;
    const record = await ServiceRecord.findByPk(id);
    if (!record) return;
    await record.update({ tourRequestId, status, recordDate, comments });
    return;
  } catch (error) {
    return;
  }
};

export const deleteServiceRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const record = await ServiceRecord.findByPk(id);
    if (!record) return;
    await record.destroy();
    return;
  } catch (error) {
    return;
  }
};

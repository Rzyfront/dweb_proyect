import { Request, Response } from 'express';
import User from '../models/User';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const user = await User.create({ username, password, email });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo registrar el usuario' });
  }
};

export const login = async (req: Request, res: Response) => {
  // Aquí iría la lógica de autenticación
  res.json({ message: 'Login endpoint' });
};
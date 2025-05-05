import { Request, Response, NextFunction } from 'express';

const validate = (req: Request, res: Response, next: NextFunction) => {
  // Validación simple de campos requeridos
  const { username, password, email } = req.body;
  if (req.path === '/register' && (!username || !password || !email)) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  if (req.path === '/login' && (!username || !password)) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  next();
};

export default validate;
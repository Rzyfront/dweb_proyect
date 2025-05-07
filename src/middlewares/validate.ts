import { Request, Response, NextFunction } from 'express';

const validate = (req: Request, res: Response, next: NextFunction): void => {
  // Validación simple de campos requeridos
  const { username, password, email } = req.body;
  if (req.path === '/register' && (!username || !password || !email)) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  if (req.path === '/login' && (!username || !password)) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  next();
};

export default validate;
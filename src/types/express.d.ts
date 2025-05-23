// src/types/express.d.ts
import User from '../models/User'; // Ajusta la ruta si es necesario

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

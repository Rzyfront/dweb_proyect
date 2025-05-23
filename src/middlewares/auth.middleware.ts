import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/auth/User'; // Corregida la ruta
import RefreshToken from '../models/auth/RefreshToken'; // Corregida la ruta
import Role from '../models/auth/Role'; // Corregida la ruta
import Resource from '../models/auth/Resource'; // Corregida la ruta
import ResourceRole from '../models/auth/ResourceRole'; // Corregida la ruta
import { TokenPayload, UserStatus, RefreshTokenStatus, HttpMethod } from '../types/auth.types'; // Corregida la ruta

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided or token format is incorrect' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const refreshTokenHeader = req.headers['x-refresh-token'] as string;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as TokenPayload;
    const user = await User.findByPk(decoded.userId, {
      include: [{ model: Role, as: 'roles' }]
    });

    if (!user || user.status !== UserStatus.ACTIVATE) {
      res.status(401).json({ message: 'User not found or not active' });
      return;
    }

    req.user = user;
    next(); 
    return;

  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      if (!refreshTokenHeader) {
        res.status(401).json({ message: 'Access token expired and no refresh token provided' });
        return;
      }

      try {
        const refreshTokenInstance = await RefreshToken.findOne({
          where: {
            token: refreshTokenHeader,
            status: RefreshTokenStatus.ACTIVE
          }
        });

        if (!refreshTokenInstance || refreshTokenInstance.isExpired()) {
          if(refreshTokenInstance) {
            refreshTokenInstance.status = RefreshTokenStatus.REVOKED;
            await refreshTokenInstance.save();
          }
          res.status(401).json({ message: 'Invalid or expired refresh token' });
          return;
        }

        const user = await User.findByPk(refreshTokenInstance.user_id, {
          include: [{ model: Role, as: 'roles' }]
        });

        if (!user || user.status !== UserStatus.ACTIVATE) {
          res.status(401).json({ message: 'User associated with refresh token not found or not active' });
          return;
        }

        const newAccessToken = user.generateToken();
        res.setHeader('x-access-token', newAccessToken);
        req.user = user;
        next();
        return;

      } catch (refreshError: any) {
        res.status(401).json({ message: 'Error processing refresh token', error: refreshError.message });
        return;
      }
    } else {
      res.status(401).json({ message: 'Invalid token', error: error.message });
      return;
    }
  }
};

export const authorizeMiddleware = (resourcePath: string, method: HttpMethod) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const userRoles = req.user.roles?.map((role: Role) => role.id) || [];
    if (userRoles.length === 0) {
      res.status(403).json({ message: 'User has no assigned roles' });
      return;
    }

    try {
      const resource = await Resource.findOne({
        where: { path: resourcePath, method: method, status: 'ACTIVATE' }
      });

      if (!resource) {
        res.status(404).json({ message: `Resource not found or inactive: ${method} ${resourcePath}` });
        return;
      }

      const hasPermission = await ResourceRole.findOne({
        where: {
          resource_id: resource.id,
          role_id: userRoles,
          status: 'ACTIVATE'
        }
      });

      if (!hasPermission) {
        res.status(403).json({ message: 'User does not have permission for this resource' });
        return;
      }

      next();
      return;
    } catch (error: any) {
      console.error('Authorization error:', error);
      res.status(500).json({ message: 'Error during authorization', error: error.message });
      return;
    }
  };
};

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/User'; // Ajusta la ruta según tu estructura
import RefreshToken from '../../models/RefreshToken'; // Ajusta la ruta según tu estructura
import Role from '../../models/auth/Role';
import Resource from '../../models/auth/Resource';
import ResourceRole from '../../models/auth/ResourceRole';
import { TokenPayload, UserStatus, RefreshTokenStatus, HttpMethod } from '../../types/auth.types'; // Ajusta la ruta

declarations:
// Extender el objeto Request de Express para incluir la propiedad user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or token format is incorrect' });
  }

  const token = authHeader.split(' ')[1];
  const refreshTokenHeader = req.headers['x-refresh-token'] as string;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as TokenPayload;
    const user = await User.findByPk(decoded.userId, {
      include: [{ model: Role, as: 'roles' }]
    });

    if (!user || user.status !== UserStatus.ACTIVATE) {
      return res.status(401).json({ message: 'User not found or not active' });
    }

    req.user = user;
    return next(); // Token válido y usuario activo

  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      if (!refreshTokenHeader) {
        return res.status(401).json({ message: 'Access token expired and no refresh token provided' });
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
          return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }

        const user = await User.findByPk(refreshTokenInstance.user_id, {
          include: [{ model: Role, as: 'roles' }]
        });

        if (!user || user.status !== UserStatus.ACTIVATE) {
          return res.status(401).json({ message: 'User associated with refresh token not found or not active' });
        }

        // Generar nuevo token de acceso
        const newAccessToken = user.generateToken();
        res.setHeader('x-access-token', newAccessToken);
        req.user = user;
        return next();

      } catch (refreshError) {
        return res.status(401).json({ message: 'Error processing refresh token', error: refreshError });
      }
    } else {
      return res.status(401).json({ message: 'Invalid token', error: error.message });
    }
  }
};

export const authorizeMiddleware = (resourcePath: string, method: HttpMethod) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userRoles = req.user.roles?.map(role => role.id) || [];
    if (userRoles.length === 0) {
      return res.status(403).json({ message: 'User has no assigned roles' });
    }

    try {
      const resource = await Resource.findOne({
        where: { path: resourcePath, method: method, status: 'ACTIVATE' }
      });

      if (!resource) {
        return res.status(404).json({ message: `Resource not found or inactive: ${method} ${resourcePath}` });
      }

      const hasPermission = await ResourceRole.findOne({
        where: {
          resource_id: resource.id,
          role_id: userRoles, // Sequelize buscará si alguna de las role_id coincide
          status: 'ACTIVATE'
        }
      });

      if (!hasPermission) {
        return res.status(403).json({ message: 'User does not have permission for this resource' });
      }

      return next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({ message: 'Error during authorization' });
    }
  };
};

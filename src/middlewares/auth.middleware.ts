import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/auth/User';
import RefreshToken from '../models/auth/RefreshToken';
import Role from '../models/auth/Role';
import Resource from '../models/auth/Resource';
import ResourceRole from '../models/auth/ResourceRole';
import { TokenPayload, UserStatus, RefreshTokenStatus, HttpMethod, RoleStatus, ResourceStatus } from '../types/auth.types';
import { pathToRegexp } from 'path-to-regexp';
import RoleUser from '../models/auth/RoleUser';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const currentRoute = req.originalUrl;
  const currentMethod = req.method;

  console.log('Current route:', currentRoute);
  console.log('Current method:', currentMethod);

  if (!token) {
    res.status(401).json({ error: 'Acceso denegado: No se proporcionó el token principal.' });
    return;
  }

  try {
    // Verificar si el token principal es válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as TokenPayload;

    // Buscar el usuario en la base de datos
    const user: User | null = await User.findOne({ 
      where: { 
        id: decoded.userId, 
        status: UserStatus.ACTIVATE 
      },
      include: [{ model: Role, as: 'roles' }]
    });

    if (!user) {
      res.status(401).json({ error: 'Usuario no encontrado o inactivo.' });
      return;
    }

    // Obtener el último registro de refresh_token para este usuario
    const lastRefreshToken = await RefreshToken.findOne({
      where: { user_id: user.id },
      order: [['createdAt', 'DESC']], // Ordenar por fecha de creación descendente
    });

    if (!lastRefreshToken) {
      res.status(401).json({ error: 'No se encontró un refresh token válido.' });
      return;
    }

    // Verificar si el último refresh_token ha expirado
    if (lastRefreshToken.expires_at < new Date()) {
      // El refresh_token ha expirado, generar uno nuevo
      const { token: newRefreshToken, expiresAt } = user.generateRefreshToken();

      // Crear un nuevo registro en la tabla refresh_tokens
      await RefreshToken.create({
        user_id: user.id,
        token: newRefreshToken,
        device_info: req.headers['user-agent'] || 'unknown',
        status: RefreshTokenStatus.ACTIVE,
        expires_at: expiresAt,
      });

      // Invalidar el refresh_token anterior
      await lastRefreshToken.update({ status: RefreshTokenStatus.REVOKED });

      // Enviar el nuevo refresh_token en el encabezado
      res.setHeader('x-reset-token', newRefreshToken);
    }

    // Validar autorización
    const isAuthorized = await validateAuthorization(decoded.userId, currentRoute, currentMethod);
    if (!isAuthorized) {
      res.status(403).json({ error: 'No está autorizado para ejecutar esta petición.' });
      return;
    }

    // Agregar usuario al request para uso posterior
    req.user = user;

    // Continuar con la solicitud
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'El token principal ha expirado.' });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Token inválido.' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor.', details: error.message });
    }
  }
};

export const validateAuthorization = async (userId: number, resourcePath: string, resourceMethod: string): Promise<boolean> => {
  try {
    // Obtener todos los recursos activos que coincidan con el método
    const resources = await Resource.findAll({
      where: { 
        method: resourceMethod, 
        status: ResourceStatus.ACTIVATE 
      },
    });

    // Convertir las rutas dinámicas a expresiones regulares y buscar coincidencias
    const matchingResource = resources.find((resource) => {
      const { regexp } = pathToRegexp(resource.path);
      return regexp.test(resourcePath);
    });

    if (!matchingResource) {
      return false; // No hay coincidencias para la ruta y el método
    }

    // Verificar si existe una relación válida entre el usuario, su rol y el recurso solicitado
    const resourceRole = await ResourceRole.findOne({
      include: [
        {
          model: Role,
          as: 'role',
          include: [
            {
              model: RoleUser,
              as: 'roleUsers',
              where: { 
                user_id: userId, 
                status: RoleStatus.ACTIVATE 
              }, // Validar que el usuario esté asociado al rol
            },
          ],
          where: { status: RoleStatus.ACTIVATE }, // Validar que el rol esté activo
        },
      ],
      where: { 
        resource_id: matchingResource.id, 
        status: RoleStatus.ACTIVATE 
      }, // Validar que la relación resource_role esté activa
    });

    return !!resourceRole; // Retorna true si se encuentra un registro coincidente
  } catch (error) {
    console.error('Error al validar la autorización:', error);
    return false;
  }
};

export const authorizeMiddleware = (resourcePathPattern?: string, method?: HttpMethod) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const userId = req.user.id;
    const requestPath = resourcePathPattern ? req.baseUrl + (req.route.path === '*' ? '/' + req.params[0] : req.route.path) : req.path; 
    const requestMethod = method ? method : req.method.toUpperCase() as HttpMethod;

    try {
      const isAuthorized = await validateAuthorization(userId, requestPath, requestMethod);
      
      if (!isAuthorized) {
        res.status(403).json({ message: 'Access denied. User does not have permission for this resource.' });
        return;
      }

      console.log(`User ID: ${userId} has authorized access to ${requestMethod} ${requestPath}`);
      next();
      return;

    } catch (error: any) {
      console.error('Authorization error:', error);
      res.status(500).json({ message: 'Error during authorization', error: error.message });
      return;
    }
  };
};

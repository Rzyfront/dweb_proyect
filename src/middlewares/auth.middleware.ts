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
        status: RefreshTokenStatus.ACTIVATE,
        expires_at: expiresAt,
      });

      // Invalidar el refresh_token anterior
      await lastRefreshToken.update({ status: RefreshTokenStatus.DEACTIVATE });

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
    console.log('\n🔍 === INICIANDO VALIDACIÓN DE AUTORIZACIÓN ===');
    console.log(`👤 Usuario ID: ${userId}`);
    console.log(`🛣️  Ruta solicitada: ${resourcePath}`);
    console.log(`📋 Método HTTP: ${resourceMethod}`);

    // Obtener todos los recursos activos que coincidan con el método
    const resources = await Resource.findAll({
      where: { 
        method: resourceMethod, 
        status: ResourceStatus.ACTIVATE 
      },
    });

    console.log(`📊 Recursos encontrados con método ${resourceMethod}:`, resources.length);
    resources.forEach((resource, index) => {
      console.log(`   ${index + 1}. ID: ${resource.id} | Path: ${resource.path} | Status: ${resource.status}`);
    });

    // Convertir las rutas dinámicas a expresiones regulares y buscar coincidencias
    console.log('\n🔄 Analizando coincidencias de rutas...');
    const matchingResource = resources.find((resource) => {
      const { regexp } = pathToRegexp(resource.path);
      const isMatch = regexp.test(resourcePath);
      console.log(`   ✅ Comparando: "${resource.path}" con "${resourcePath}" | RegExp: ${regexp} | Match: ${isMatch}`);
      return isMatch;
    });

    if (!matchingResource) {
      console.log('❌ No se encontró ningún recurso que coincida con la ruta y método solicitados');
      console.log('🔚 === FIN VALIDACIÓN (NO AUTORIZADO) ===\n');
      return false; // No hay coincidencias para la ruta y el método
    }

    console.log(`✅ Recurso coincidente encontrado: ID ${matchingResource.id} | Path: ${matchingResource.path}`);

    // Verificar si existe una relación válida entre el usuario, su rol y el recurso solicitado
    console.log('\n🔗 Verificando relaciones usuario-rol-recurso...');
    
    // Primero, obtener todos los roles del usuario que están activos (consulta simple)
    const userRoles = await RoleUser.findAll({
      where: { 
        user_id: userId, 
        status: RoleStatus.ACTIVATE 
      }
    });

    console.log(`👥 Relaciones usuario-rol encontradas: ${userRoles.length}`);
    
    if (userRoles.length === 0) {
      console.log('❌ El usuario no tiene roles asignados');
      console.log('🔚 === FIN VALIDACIÓN (NO AUTORIZADO) ===\n');
      return false;
    }

    // Obtener los IDs de los roles del usuario
    const roleIds = userRoles.map(userRole => userRole.role_id);
    console.log(`🔑 IDs de roles a verificar: [${roleIds.join(', ')}]`);

    // Verificar que los roles estén activos
    const activeRoles = await Role.findAll({
      where: { 
        id: roleIds,
        status: RoleStatus.ACTIVATE 
      }
    });

    console.log(`👥 Roles activos encontrados: ${activeRoles.length}`);
    activeRoles.forEach((role, index) => {
      console.log(`   ${index + 1}. Rol ID: ${role.id} | Nombre: ${role.name} | Status: ${role.status}`);
    });

    if (activeRoles.length === 0) {
      console.log('❌ El usuario no tiene roles activos');
      console.log('🔚 === FIN VALIDACIÓN (NO AUTORIZADO) ===\n');
      return false;
    }

    const activeRoleIds = activeRoles.map(role => role.id);

    // Verificar si alguno de estos roles tiene acceso al recurso (consulta simple)
    const resourceRole = await ResourceRole.findOne({
      where: { 
        resource_id: matchingResource.id,
        role_id: activeRoleIds,
        status: RoleStatus.ACTIVATE 
      }
    });

    if (resourceRole) {
      // Obtener detalles del rol y recurso para el debug
      const roleDetails = activeRoles.find(role => role.id === resourceRole.role_id);
      
      console.log('✅ Autorización EXITOSA:');
      console.log(`   🎯 Recurso ID: ${resourceRole.resource_id} | Path: ${matchingResource.path}`);
      console.log(`   👥 Rol ID: ${resourceRole.role_id} | Nombre: ${roleDetails?.name || 'N/A'}`);
      console.log(`   🔐 Status ResourceRole: ${resourceRole.status}`);
      console.log('🔚 === FIN VALIDACIÓN (AUTORIZADO) ===\n');
      return true;
    } else {
      console.log('❌ No se encontró una relación válida recurso-rol para este usuario');
      console.log('   Detalles:');
      console.log(`   - Recurso ID: ${matchingResource.id}`);
      console.log(`   - Roles activos del usuario: [${activeRoleIds.join(', ')}]`);
      console.log('   Posibles causas:');
      console.log('   - Ninguno de los roles del usuario tiene acceso a este recurso');
      console.log('   - La relación recurso-rol está desactivada');
      console.log('🔚 === FIN VALIDACIÓN (NO AUTORIZADO) ===\n');
      return false;
    }

  } catch (error) {
    console.error('💥 Error al validar la autorización:', error);
    console.log('🔚 === FIN VALIDACIÓN (ERROR) ===\n');
    return false;
  }
};
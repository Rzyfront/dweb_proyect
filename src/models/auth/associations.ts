// Archivo para manejar todas las asociaciones entre modelos de autenticación
// Esto evita importaciones circulares

import User from './User';
import Role from './Role';
import Resource from './Resource';
import RoleUser from './RoleUser';
import ResourceRole from './ResourceRole';
import RefreshToken from './RefreshToken';

export const initAuthAssociations = () => {
  // Asociaciones User-Role (muchos a muchos)
  User.belongsToMany(Role, {
    through: RoleUser,
    foreignKey: 'user_id',
    otherKey: 'role_id',
    as: 'roles'
  });

  Role.belongsToMany(User, {
    through: RoleUser,
    foreignKey: 'role_id',
    otherKey: 'user_id',
    as: 'users'
  });

  // Asociaciones Role-Resource (muchos a muchos)
  Role.belongsToMany(Resource, {
    through: ResourceRole,
    foreignKey: 'role_id',
    otherKey: 'resource_id',
    as: 'resources'
  });

  Resource.belongsToMany(Role, {
    through: ResourceRole,
    foreignKey: 'resource_id',
    otherKey: 'role_id',
    as: 'roles'
  });

  // Asociaciones RefreshToken-User (uno a muchos)
  User.hasMany(RefreshToken, {
    foreignKey: 'user_id',
    as: 'refreshTokens'
  });

  RefreshToken.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  // Asociaciones para las tablas intermedias
  RoleUser.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  RoleUser.belongsTo(Role, {
    foreignKey: 'role_id',
    as: 'role'
  });

  // Asociaciones inversas necesarias para includes
  User.hasMany(RoleUser, {
    foreignKey: 'user_id',
    as: 'roleUsers'
  });

  Role.hasMany(RoleUser, {
    foreignKey: 'role_id',
    as: 'roleUsers'
  });

  ResourceRole.belongsTo(Role, {
    foreignKey: 'role_id',
    as: 'role'
  });

  ResourceRole.belongsTo(Resource, {
    foreignKey: 'resource_id',
    as: 'resource'
  });

  // Asociaciones inversas para ResourceRole
  Role.hasMany(ResourceRole, {
    foreignKey: 'role_id',
    as: 'resourceRoles'
  });

  Resource.hasMany(ResourceRole, {
    foreignKey: 'resource_id',
    as: 'resourceRoles'
  });
};

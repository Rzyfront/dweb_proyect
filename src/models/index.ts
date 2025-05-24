import sequelize from '../config/database';
// Modelos de negocio
import Customer from './Customer';
import TourPlan from './TourPlan';
import TouristSite from './TouristSite';
import TourRequest from './TourRequest';
import ServiceRecord from './ServiceRecord';
import TourPlanTouristSite from './TourPlanTouristSite';
// Modelos de autenticación
import User from './auth/User';
import Role from './auth/Role';
import Resource from './auth/Resource';
import RoleUser from './auth/RoleUser';
import ResourceRole from './auth/ResourceRole';
import RefreshToken from './auth/RefreshToken';

// Definir asociaciones después de importar todos los modelos

// === ASOCIACIONES DE MODELOS DE NEGOCIO ===

// Customer-TourRequest (1:N)
Customer.hasMany(TourRequest, {
  foreignKey: 'customerId',
  as: 'tourRequests'
});

TourRequest.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer'
});

// TourPlan-TourRequest (1:N)
TourPlan.hasMany(TourRequest, {
  foreignKey: 'tourPlanId',
  as: 'tourRequests'
});

TourRequest.belongsTo(TourPlan, {
  foreignKey: 'tourPlanId',
  as: 'tourPlan'
});

// TourRequest-ServiceRecord (1:N)
TourRequest.hasMany(ServiceRecord, {
  foreignKey: 'tourRequestId',
  as: 'serviceRecords'
});

ServiceRecord.belongsTo(TourRequest, {
  foreignKey: 'tourRequestId',
  as: 'tourRequest'
});

// TourPlan-TouristSite (N:M) a través de TourPlanTouristSite
TourPlan.belongsToMany(TouristSite, {
  through: TourPlanTouristSite,
  foreignKey: 'tourPlanId',
  otherKey: 'touristSiteId',
  as: 'touristSites'
});

TouristSite.belongsToMany(TourPlan, {
  through: TourPlanTouristSite,
  foreignKey: 'touristSiteId',
  otherKey: 'tourPlanId',
  as: 'tourPlans'
});

// Asociaciones para la tabla intermedia TourPlanTouristSite
TourPlanTouristSite.belongsTo(TourPlan, {
  foreignKey: 'tourPlanId',
  as: 'tourPlan'
});

TourPlanTouristSite.belongsTo(TouristSite, {
  foreignKey: 'touristSiteId',
  as: 'touristSite'
});

TourPlan.hasMany(TourPlanTouristSite, {
  foreignKey: 'tourPlanId',
  as: 'tourPlanTouristSites'
});

TouristSite.hasMany(TourPlanTouristSite, {
  foreignKey: 'touristSiteId',
  as: 'tourPlanTouristSites'
});

// === ASOCIACIONES DE MODELOS DE AUTENTICACIÓN ===

// User-Role (muchos a muchos)
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

// Role-Resource (muchos a muchos)
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

// RefreshToken-User (uno a muchos)
User.hasMany(RefreshToken, {
  foreignKey: 'user_id',
  as: 'refreshTokens'
});

RefreshToken.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

import sequelize from '../config/database';
import './Customer';
import './TourPlan';
import './TouristSite';
import './TourRequest';
import './ServiceRecord';
import './TourPlanTouristSite';
import './auth/User';

export const syncModels = async () => {
  try {
    await sequelize.authenticate();
    // Sincronizar todos los modelos con la base de datos
    await sequelize.sync({ force: true }); // Elimina y recrea todas las tablas en la base de datos
    console.log('Database connection and model synchronization successful (force: true).');
  } catch (error) {
    console.error('Error connecting or synchronizing with the database:', error);
    process.exit(1);
  }
};
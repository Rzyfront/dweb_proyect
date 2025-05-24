import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import sequelize from './config/database'; // Asegúrate que la ruta sea correcta

// Importar modelos para que Sequelize los conozca (especialmente si tienen asociaciones)
import './models/auth/User';
import './models/auth/RefreshToken';
import './models/auth/Role';
import './models/auth/RoleUser';
import './models/auth/Resource';
import './models/auth/ResourceRole';
// ...otros modelos

// Importar rutas
import authRoutes from './routes/auth.routes'; // Asegúrate que la ruta sea correcta
import customerRoutes from './routes/customer.routes';
import userRoutes from './routes/user.routes'; // Ejemplo, si tienes más rutas
import touristSiteRoutes from './routes/touristSite.routes';
import tourPlanRoutes from './routes/tourPlan.routes';
import serviceRecordRoutes from './routes/serviceRecord.routes';
import tourRequestRoutes from './routes/tourRequest.routes';
import tourPlanTouristSiteRoutes from './routes/tourPlanTouristSite.routes';
import roleRoutes from './routes/role.routes'; // <--- Nueva importación
import resourceRoutes from './routes/resource.routes'; // <--- Nueva importación

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/users', userRoutes); // Ejemplo
app.use('/api/tourist-sites', touristSiteRoutes);
app.use('/api/tour-plans', tourPlanRoutes);
app.use('/api/service-records', serviceRecordRoutes);
app.use('/api/tour-requests', tourRequestRoutes);
app.use('/api/tour-plan-tourist-sites', tourPlanTouristSiteRoutes);
app.use('/api/roles', roleRoutes); // <--- Nueva ruta para roles
app.use('/api/resources', resourceRoutes); // <--- Nueva ruta para recursos

app.get('/', (req, res) => {
  const env = process.env.NODE_ENV || 'development';
  res.json({
    message: 'Server is running! 🚀',
    environment: env
  });
});

// Sincronización con la base de datos
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
    // Sincronizar modelos:
    // sequelize.sync() - Crea las tablas si no existen. No borra datos.
    // sequelize.sync({ force: true }) - Borra las tablas existentes y las recrea. ¡CUIDADO EN PRODUCCIÓN!
    // sequelize.sync({ alter: true }) - Intenta alterar las tablas para que coincidan con los modelos.
    await sequelize.sync({ alter: true }); // O la opción que prefieras para desarrollo/producción
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database or synchronize models:', error);
  }
};

connectDB();

export default app;
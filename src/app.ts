import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import customerRoutes from './routes/customer.routes';
import userRoutes from './routes/user.routes';
import touristSiteRoutes from './routes/touristSite.routes';
import tourPlanRoutes from './routes/tourPlan.routes';
import serviceRecordRoutes from './routes/serviceRecord.routes';
import tourRequestRoutes from './routes/tourRequest.routes';
import tourPlanTouristSiteRoutes from './routes/tourPlanTouristSite.routes';
import { authenticateJWT } from './middlewares/authenticateJWT';

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/customers', authenticateJWT, customerRoutes);
app.use('/api/users', authenticateJWT, userRoutes);
app.use('/api/tourist-sites', authenticateJWT, touristSiteRoutes);
app.use('/api/tour-plans', authenticateJWT, tourPlanRoutes);
app.use('/api/service-records', authenticateJWT, serviceRecordRoutes);
app.use('/api/tour-requests', authenticateJWT, tourRequestRoutes);
app.use('/api/tour-plan-tourist-sites', authenticateJWT, tourPlanTouristSiteRoutes);

app.get('/', (req, res) => {
  const env = process.env.NODE_ENV || 'development';
  res.json({
    message: 'Server is running! 🚀',
    environment: env
  });
});

export default app;
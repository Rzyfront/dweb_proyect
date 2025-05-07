import sequelize from '../config/database';
import User from '../models/User';

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    await User.create({ username: 'admin', password: 'admin123', email: 'admin@example.com' });
    console.log('Datos de ejemplo insertados');
    process.exit(0);
  } catch (error) {
    console.error('Error al insertar datos de ejemplo:', error);
    process.exit(1);
  }
};

seed();
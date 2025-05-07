import dotenv from 'dotenv';
import app from './app';
import { syncModels } from './models';

// Configuración de variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;

// Conectar y sincronizar los modelos con la base de datos
syncModels();

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
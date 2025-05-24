import dotenv from 'dotenv';
import app from './app';

// Configuración de variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;


// Inicializar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
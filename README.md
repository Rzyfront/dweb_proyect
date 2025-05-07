# dweb_proyect

Proyecto backend para la gestión de una empresa de turismo. Permite administrar usuarios, clientes, sitios turísticos, planes turísticos, solicitudes de tours y registros de servicio. Incluye autenticación JWT y validaciones robustas.

## Tabla de Contenidos
- [Requisitos previos](#requisitos-previos)
- [Configuración del entorno](#configuración-del-entorno)
- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Modelos y relaciones](#modelos-y-relaciones)
- [Rutas y endpoints](#rutas-y-endpoints)
- [Autenticación y validaciones](#autenticación-y-validaciones)
- [Seed de datos de ejemplo](#seed-de-datos-de-ejemplo)
- [Ejemplo de uso de la API](#ejemplo-de-uso-de-la-api)
- [Notas y créditos](#notas-y-créditos)

---

## Requisitos previos
- Node.js >= 20
- MySQL (o modificar .env para otro motor soportado por Sequelize)

## Configuración del entorno
1. Clona el repositorio y entra a la carpeta del proyecto.
2. Crea un archivo `.env` en la raíz con la siguiente estructura:

```
PORT=3000
DB_ENGINE=mysql
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Desarrollo123$%
DB_NAME=empresa_turismo
DB_PORT=3306
NODE_ENV=development
```

3. Asegúrate de tener la base de datos creada en tu motor (por defecto `empresa_turismo` en MySQL).

## Instalación

```bash
npm install
```

## Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

## Estructura del proyecto

```
├── src/
│   ├── app.ts                # Configuración principal de la app Express
│   ├── server.ts             # Punto de entrada, inicia servidor y sincroniza modelos
│   ├── config/
│   │   └── database.ts       # Configuración de Sequelize y conexión a BD
│   ├── controllers/          # Lógica de negocio y controladores de cada recurso
│   ├── middlewares/          # Middlewares de validación y autenticación
│   ├── models/               # Definición de modelos Sequelize
│   ├── routes/               # Definición de rutas y endpoints
│   ├── seed/                 # Script para poblar la BD con datos de ejemplo
│   └── ...
├── package.json
├── tsconfig.json
├── .env
```

## Modelos y relaciones
- **User**: Usuarios del sistema (autenticación).
- **Customer**: Clientes que solicitan tours.
- **TouristSite**: Sitios turísticos disponibles.
- **TourPlan**: Planes turísticos ofrecidos.
- **TourRequest**: Solicitudes de tours hechas por clientes.
- **ServiceRecord**: Registros de servicio asociados a solicitudes.
- **TourPlanTouristSite**: Tabla pivote para relación muchos a muchos entre planes y sitios turísticos.

## Rutas y endpoints principales

### Autenticación
- `POST /api/auth/register` — Registro de usuario
- `POST /api/auth/login` — Login y obtención de JWT

### Usuarios (requiere JWT)
- `GET /api/users/`
- `GET /api/users/:id`
- `POST /api/users/`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### Clientes (requiere JWT)
- `GET /api/customers/`
- `GET /api/customers/:id`
- `POST /api/customers/`
- `PUT /api/customers/:id`
- `DELETE /api/customers/:id`

### Sitios turísticos (requiere JWT)
- `GET /api/tourist-sites/`
- `GET /api/tourist-sites/:id`
- `POST /api/tourist-sites/`
- `PUT /api/tourist-sites/:id`
- `DELETE /api/tourist-sites/:id`

### Planes turísticos (requiere JWT)
- `GET /api/tour-plans/`
- `GET /api/tour-plans/:id`
- `POST /api/tour-plans/`
- `PUT /api/tour-plans/:id`
- `DELETE /api/tour-plans/:id`

### Solicitudes de tour (requiere JWT)
- `GET /api/tour-requests/`
- `GET /api/tour-requests/:id`
- `POST /api/tour-requests/`
- `PUT /api/tour-requests/:id`
- `DELETE /api/tour-requests/:id`

### Registros de servicio (requiere JWT)
- `GET /api/service-records/`
- `GET /api/service-records/:id`
- `POST /api/service-records/`
- `PUT /api/service-records/:id`
- `DELETE /api/service-records/:id`

### Relación Plan-Sitio Turístico (requiere JWT)
- `GET /api/tour-plan-tourist-sites/`
- `GET /api/tour-plan-tourist-sites/:tourPlanId/:touristSiteId`
- `POST /api/tour-plan-tourist-sites/`
- `PUT /api/tour-plan-tourist-sites/:tourPlanId/:touristSiteId`
- `DELETE /api/tour-plan-tourist-sites/:tourPlanId/:touristSiteId`

## Autenticación y validaciones
- Autenticación JWT obligatoria para todos los endpoints excepto `/api/auth/*`.
- Validaciones de datos con `express-validator` en todos los endpoints de creación y actualización.
- Middleware `validate` centraliza el manejo de errores de validación.

## Seed de datos de ejemplo
Para poblar la base de datos con datos de ejemplo ejecuta:

```bash
npx ts-node src/seed/seed.ts
```

Esto eliminará y recreará las tablas, insertando datos aleatorios para pruebas.

## Ejemplo de uso de la API
1. Registra un usuario:
   ```bash
   curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"username":"admin","email":"admin@mail.com","password":"123456"}'
   ```
2. Haz login y obtén el token:
   ```bash
   curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"123456"}'
   ```
3. Usa el token en los endpoints protegidos:
   ```bash
   curl -H "Authorization: Bearer TU_TOKEN" http://localhost:3000/api/customers/
   ```

## Notas y créditos
- Proyecto realizado para la asignatura de Desarrollo Web, Universidad de La Guajira.
- Tecnologías: Node.js, Express, TypeScript, Sequelize, MySQL.
- Autores: [Completa aquí los nombres del equipo]

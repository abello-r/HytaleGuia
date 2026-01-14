# 🚀 React + Node.js + MongoDB & Docker

Template simple para iniciar un proyecto full-stack con React, Node.js, Express y MongoDB usando Docker Compose.

## 📁 Estructura del Proyecto

```
proyecto/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js
        ├── App.css
        ├── index.js
        └── index.css
```

## 🛠️ Requisitos

- Docker
- Docker Compose
- Cuenta de MongoDB Atlas (gratis)

## ⚙️ Configuración

1. **Crear cluster en MongoDB Atlas:**
   - Ve a https://www.mongodb.com/cloud/atlas
   - Crea una cuenta gratuita
   - Crea un nuevo cluster (el tier gratuito es suficiente)
   - En "Database Access" crea un usuario con contraseña
   - En "Network Access" añade tu IP o permite acceso desde cualquier lugar (0.0.0.0/0)
   - Obtén tu connection string

2. **Configurar variables de entorno:**
   - Crea un archivo `.env` en la raíz del proyecto
   - Añade tu connection string de MongoDB Atlas:
   ```
   MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/myapp?retryWrites=true&w=majority
   ```

## 🚀 Iniciar la Aplicación

1. **Construir y levantar los contenedores:**
```bash
docker-compose up --build
```

2. **Acceder a la aplicación:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Comandos Útiles

**Detener los contenedores:**
```bash
docker-compose down
```

**Ver logs:**
```bash
docker-compose logs -f
```

**Reconstruir contenedores:**
```bash
docker-compose up --build --force-recreate
```

**Eliminar volúmenes (resetear BD):**
```bash
docker-compose down -v
```

## 📦 Funcionalidades

La aplicación incluye un CRUD simple de items con:
- Crear items (nombre y descripción)
- Listar todos los items
- Eliminar items

## 🔌 API Endpoints

- `GET /api/items` - Obtener todos los items
- `POST /api/items` - Crear un nuevo item
- `DELETE /api/items/:id` - Eliminar un item

## 💡 Notas

- Los cambios en el código se reflejan automáticamente (hot reload)
- Los datos de MongoDB se persisten en un volumen Docker
- El backend se conecta a MongoDB usando el nombre del servicio `mongodb`
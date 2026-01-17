# 🎮 HytaleGuía

<div align="center">

![Hytale Guide](https://img.shields.io/badge/Hytale-Guide-00d2ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)

**La enciclopedia definitiva de Hytale en español**

[🌐 Demo](https://hytaleguia.com) • [📖 Documentación](#características) • [🐛 Reportar Bug](https://github.com/abello-r/HytaleGuia/issues)

</div>

---

## 📋 Descripción

HytaleGuía es la comunidad hispana más grande dedicada a Hytale. Una plataforma completa que ofrece guías, noticias, mods, listado de servidores y mucho más, todo con una interfaz moderna y multiidioma.

### ✨ Características

- 🌍 **Multiidioma** - Soporte para Español, Inglés, Francés, Italiano y Portugués
- 🎨 **Diseño Moderno** - UI con Glassmorphism y animaciones suaves
- 🔍 **Búsqueda IA** - Motor de búsqueda potenciado por inteligencia artificial
- 🎯 **Hot Reload** - Desarrollo ágil con recarga automática
- 📱 **Responsive** - Diseño adaptable a todos los dispositivos
- 🐳 **Docker** - Despliegue fácil con contenedores
- 🔒 **SSL** - Certificados SSL configurados
- 📊 **Analytics** - Google Analytics integrado

---

## 🚀 Tech Stack

### Frontend
- **React 18.3** - Biblioteca UI
- **TypeScript 5.6** - Tipado estático
- **Vite 6.0** - Build tool ultra-rápido
- **Tailwind CSS 3.4** - Framework CSS utility-first
- **i18next** - Internacionalización

### Backend
- **Node.js 20** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL

### DevOps
- **Docker & Docker Compose** - Contenedores
- **Nginx** - Reverse proxy y servidor web
- **GitHub Actions** - CI/CD (próximamente)

---

## 📦 Instalación

### Requisitos Previos

- Node.js 20+
- Docker & Docker Compose
- Git

### Desarrollo Local

```bash
# Clonar el repositorio
git clone https://github.com/abello-r/HytaleGuia.git
cd HytaleGuia

# Instalar dependencias del frontend
cd frontend
npm install

# Instalar dependencias del backend
cd ../backend
npm install

# Volver a la raíz
cd ..
```

### Con Docker (Recomendado)

```bash
# Levantar todos los servicios
docker-compose up
```

La aplicación estará disponible en:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Nginx**: http://localhost

---

## 🛠️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/hytaleguia

# Backend
PORT=5000

# Frontend (opcional)
VITE_API_URL=http://localhost:5000
```

### Hot Reload en Docker

El proyecto está configurado con hot reload automático. Los cambios en `frontend/src` se reflejan instantáneamente sin reiniciar el contenedor.

---

## 📁 Estructura del Proyecto

```
HytaleGuia/
├── frontend/                # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── locales/        # Traducciones i18n
│   │   ├── App.tsx         # Componente principal
│   │   └── main.tsx        # Entry point
│   ├── public/             # Assets estáticos
│   └── Dockerfile          # Docker para producción
│
├── backend/                 # API Node.js
│   ├── server.js           # Servidor Express
│   ├── routes/             # Rutas API
│   ├── models/             # Modelos MongoDB
│   └── Dockerfile
│
├── nginx/                   # Configuración Nginx
│   ├── nginx.conf          # Config principal
│   └── certs/              # Certificados SSL
│
└── docker-compose.yml       # Docker compose
```

---

## 🌐 Multiidioma

El proyecto usa **i18next** para la internacionalización. Para añadir un nuevo idioma:

1. Crea un archivo en `frontend/src/locales/{codigo}/translation.json`
2. Añade el idioma al selector en `frontend/src/components/LanguageSelector.tsx`
3. Las traducciones se cargan automáticamente

**Idiomas soportados:**
- 🇪🇸 Español
- 🇬🇧 English
- 🇫🇷 Français
- 🇮🇹 Italiano
- 🇵🇹 Português

---

## 🎨 Paleta de Colores

```css
/* Colores principales */
--negro-profundo: #0b0d12
--azul-cyan: #00d2ff
--azul-oscuro: #0099cc
--gris-plata: #a0a0a0

/* Glassmorphism */
--cristal: rgba(255, 255, 255, 0.05)
--borde-cristal: rgba(255, 255, 255, 0.1)
```

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Sigue estos pasos:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guía de Estilo

- Usa TypeScript para todo el código nuevo
- Sigue las convenciones de Tailwind CSS
- Mantén los componentes pequeños y reutilizables
- Añade traducciones para todos los textos visibles

---

## 📝 Scripts Disponibles

### Frontend

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linter ESLint
```

### Backend

```bash
npm start            # Iniciar servidor
npm run dev          # Modo desarrollo con nodemon
```

### Docker

```bash
docker-compose up              # Iniciar servicios
docker-compose down            # Parar servicios
docker-compose logs -f         # Ver logs
```

---

## 🐛 Troubleshooting

### El hot reload no funciona

Asegúrate de tener las variables de entorno en el contenedor:
```yaml
environment:
  - CHOKIDAR_USEPOLLING=true
  - WATCHPACK_POLLING=true
```

### Error de puertos ocupados

Cambia los puertos en `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Cambiar 3000 por otro puerto
```

### Problemas con MongoDB

Verifica que MongoDB esté corriendo:
```bash
docker-compose logs backend
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👥 Autores

- **abello-r** - *Trabajo inicial* - [GitHub](https://github.com/abello-r)

---

## 🙏 Agradecimientos

- Comunidad de Hytale
- Hypixel Studios por crear Hytale
- Todos los contribuidores del proyecto

---

<div align="center">

**⭐ Si te gusta el proyecto, dale una estrella en GitHub ⭐**

Hecho con ❤️ para la comunidad de Hytale

</div>
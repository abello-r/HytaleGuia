# 🎮 HytaleGuide

<div align="center">

![Hytale Guide](https://img.shields.io/badge/Hytale-Guide-00d2ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)

**The ultimate Hytale encyclopedia in Spanish**

[🌐 Live Demo](https://hytaleguia.com) • [📖 Documentation](#features) • [🐛 Report Bug](https://github.com/abello-r/HytaleGuia/issues)

</div>

---

## 📋 Description

HytaleGuide is a comprehensive web platform dedicated to Hytale, developed as a commercial project. It combines modern frontend with React/TypeScript, Node.js backend, and content automation through N8N, all deployed with Docker.

This project showcases full-stack development, DevOps, internationalization, and microservices architecture skills.

### ✨ Features

- 🌍 **Multilingual** - Internationalization system with 5 languages
- 🎨 **Modern Design** - UI with Glassmorphism and smooth animations
- 🔍 **AI Search** - AI-powered search engine
- 🤖 **N8N Automation** - Automatic content updates through workflows
- 🎯 **Hot Reload** - Agile development with real-time reloading
- 📱 **Responsive Design** - Adaptable to all devices
- 🐳 **Dockerized** - Complete containerized infrastructure
- 🔒 **SSL/HTTPS** - Certificates configured with Nginx
- 📊 **Analytics** - Google Analytics integrated

---

## 🚀 Tech Stack

### Frontend
- **React 18.3** - UI Library
- **TypeScript 5.6** - Static typing
- **Vite 6.0** - Ultra-fast build tool
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **i18next** - Internationalization

### Backend
- **Node.js 20** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database

### DevOps & Automation
- **Docker & Docker Compose** - Containers
- **Nginx** - Reverse proxy and web server
- **N8N** - Workflow automation and content updates

---

## 📦 Installation & Deployment

> **Note:** This is a commercial project and fansite dedicated to Hytale. Code is available for portfolio and technical demonstration purposes. Not officially affiliated with Hypixel Studios or Riot Games.

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- MongoDB
- N8N (for content automation)

### Local Development

```bash
# Clone the repository
git clone https://github.com/abello-r/HytaleGuia.git
cd HytaleGuia

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Return to root
cd ..
```

### With Docker (Recommended)

```bash
# Start all services
docker-compose up
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Nginx**: http://localhost

---

## 🛠️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/hytaleguia

# Backend
PORT=5000

# Frontend (optional)
VITE_API_URL=http://localhost:5000
```

### Hot Reload in Docker

The project is configured with automatic hot reload. Changes in `frontend/src` are reflected instantly without restarting the container.

---

## 📁 Project Structure

```
HytaleGuia/
├── frontend/                # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── locales/        # i18n translations
│   │   ├── App.tsx         # Main component
│   │   └── main.tsx        # Entry point
│   ├── public/             # Static assets
│   └── Dockerfile          # Production Docker
│
├── backend/                 # Node.js API
│   ├── server.js           # Express server
│   ├── routes/             # API routes
│   ├── models/             # MongoDB models
│   └── Dockerfile
│
├── nginx/                   # Nginx configuration
│   ├── nginx.conf          # Main config
│   └── certs/              # SSL certificates
│
└── docker-compose.yml       # Docker compose
```

---

## 🎯 Architecture

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Nginx (HTTPS)  │  ← Reverse Proxy + SSL
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌──────────┐
│ React   │ │ Node.js  │
│Frontend │ │ Backend  │
└─────────┘ └────┬─────┘
                 │
            ┌────┴────┐
            │         │
            ▼         ▼
      ┌──────────┐ ┌─────────┐
      │ MongoDB  │ │   N8N   │  ← Automation
      └──────────┘ └─────────┘
```

### Content Update Flow with N8N

1. **N8N** executes scheduled workflows
2. Collects information from external sources (RSS, APIs, web scraping)
3. Processes and formats content
4. Updates MongoDB with new content
5. Frontend consumes updated data in real-time

---

## 🌐 Multilingual

The project uses **i18next** for internationalization. To add a new language:

1. Create a file in `frontend/src/locales/{code}/translation.json`
2. Add the language to the selector in `frontend/src/components/LanguageSelector.tsx`
3. Translations load automatically

**Supported languages:**
- 🇪🇸 Español
- 🇬🇧 English
- 🇫🇷 Français
- 🇮🇹 Italiano
- 🇵🇹 Português

---

## 🎨 Color Palette

```css
/* Main colors */
--deep-black: #0b0d12
--cyan-blue: #00d2ff
--dark-blue: #0099cc
--silver-gray: #a0a0a0

/* Glassmorphism */
--glass: rgba(255, 255, 255, 0.05)
--glass-border: rgba(255, 255, 255, 0.1)
```

---

## 📝 Available Scripts

### Frontend

```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview build
npm run lint         # ESLint linter
```

### Backend

```bash
npm start            # Start server
npm run dev          # Development mode with nodemon
```

### Docker

```bash
docker-compose up              # Start services
docker-compose down            # Stop services
docker-compose logs -f         # View logs
```

---

## 🐛 Troubleshooting

### Hot reload not working

Make sure you have the environment variables in the container:
```yaml
environment:
  - CHOKIDAR_USEPOLLING=true
  - WATCHPACK_POLLING=true
```

### Port already in use error

Change the ports in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change 3000 to another port
```

### MongoDB connection issues

Verify MongoDB is running:
```bash
docker-compose logs backend
```

---

## 📄 License

This project is under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## 👥 Team

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/abello-r">
        <img src="https://github.com/abello-r.png" width="100px;" alt="Alexander Bello"/><br />
        <sub><b>Alexander Bello</b></sub>
      </a><br />
      <sub>Full Stack Engineer</sub>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTExL3Jhd3BpeGVsX29mZmljZV8zMl9ibGFja19mbGF0X3ZlY3Rvcl9pbGx1c3RyYXRpb25fb2Zfc2V0X29mXzRfc18zMWNhYTI1MS0xMWMxLTRmMDktYjQzMS00ZTM0MmExMDBkOGQtMDAxLnBuZw.png" width="100px;" alt="Olman Zapata"/><br />
        <sub><b>Olman Zapata</b></sub>
      </a><br />
      <sub>Frontend Engineer</sub>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTExL3Jhd3BpeGVsX29mZmljZV8zMl9ibGFja19mbGF0X3ZlY3Rvcl9pbGx1c3RyYXRpb25fb2Zfc2V0X29mXzRfc18zMWNhYTI1MS0xMWMxLTRmMDktYjQzMS00ZTM0MmExMDBkOGQtMDAxLnBuZw.png" width="100px;" alt="Alexander Romero"/><br />
        <sub><b>Alexander Romero</b></sub>
      </a><br />
      <sub>Legal & Compliance Advisor</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/Davi-G">
        <img src="https://github.com/Davi-G.png" width="100px;" alt="David Gomez"/><br />
        <sub><b>David Gomez</b></sub>
      </a><br />
      <sub>Automation & Infrastructure Engineer</sub>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTExL3Jhd3BpeGVsX29mZmljZV8zMl9ibGFja19mbGF0X3ZlY3Rvcl9pbGx1c3RyYXRpb25fb2Zfc2V0X29mXzRfc18zMWNhYTI1MS0xMWMxLTRmMDktYjQzMS00ZTM0MmExMDBkOGQtMDAxLnBuZw.png" width="100px;" alt="Diego Corado"/><br />
        <sub><b>Diego Corado</b></sub>
      </a><br />
      <sub>UX/UI Designer</sub>
    </td>
  </tr>
</table>

---

## 🙏 Acknowledgments

- Hytale Community
- Hypixel Studios for creating Hytale
- All project contributors

---

<div align="center">

### 🌟 Commercial Hytale Fansite

**[HytaleGuide](https://hytaleguia.com)** - The Spanish Hytale Community Hub

[🌐 Visit Site](https://hytaleguia.com) • [📧 Contact](https://github.com/abello-r) • [⭐ Star on GitHub](https://github.com/abello-r/HytaleGuia)

---

*Built with ❤️ by the HytaleGuide Team*

*Not affiliated with Hypixel Studios or Riot Games*

</div>
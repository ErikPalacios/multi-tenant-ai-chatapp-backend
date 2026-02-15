# Heronova AI - Multi-Tenant Backend 🚀

> [!WARNING]
> 🚧 **PROYECTO EN PROGRESO (Work in Progress)** 🚧
> El sistema está actualmente en fase de desarrollo activo.

Heronova es una plataforma backend potente y escalable diseñada para gestionar chatbots de inteligencia artificial multi-inquilino (multi-tenant) con integración a **WhatsApp**. Está optimizada para la automatización de citas, gestión de servicios y atención al cliente automatizada.

## ✨ Características Principales

- **Arquitectura Multi-Tenant**: Aislamiento completo de datos por negocio.
- **Sistema de Autenticación JWT**: Registro de dueños, gestión de empleados y roles protegidos.
- **Motor de Citas Avanzado**: Cálculo dinámico de disponibilidad basado en días, turnos (Matutino/Vespertino/Nocturno) y horarios.
- **Máquina de Estados Propietiva (FSM)**: Flujos conversacionales robustos y persistentes.
- **Integraciones de Mensajería**: Soporte para la API Oficial de WhatsApp (Meta) y WATI.
- **Persistencia en Tiempo Real**: Integración profunda con Firebase Firestore.
- **Protección de Concurrencia**: Sistema de bloqueos (locks) para evitar duplicidad de citas.

## 🛠️ Stack Tecnológico

- **Lenguaje:** TypeScript / Node.js
- **FrameWork:** Express
- **Base de Datos:** Firebase Firestore (Admin SDK)
- **Seguridad:** JWT (jsonwebtoken) & Hashing (bcrypt)
- **Testing:** Vitest

## 🚀 Instalación y Uso

### 1. Clonar el repositorio
```bash
git clone https://github.com/Erik7u7-n8n/multi-tenant-ai-chatapp-backend.git
cd multi-tenant-ai-chatapp-backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```
Asegúrate de configurar tus credenciales de Firebase y el `JWT_SECRET`.

### 4. Ejecutar Pruebas
```bash
npm run test
```

## 📂 Estructura del Proyecto

- `src/api`: Controladores y Middlewares (Entrada del sistema).
- `src/core`: Lógica central (Orquestador, FSM, Guards).
- `src/domains`: Servicios de dominio (Citas, Usuarios, Negocios).
- `src/integrations`: Conexiones externas (Firebase, WhatsApp).
- `src/interfaces`: Definiciones de tipos y contratos.

## 📝 Próximos Pasos (To-Do)

- [ ] Implementación de Dashboard Web para dueños.
- [ ] Integración con modelos de IA avanzados (Langchain/OpenAI).
- [ ] Sistema de recordatorios automáticos por WhatsApp.
- [ ] Generación de reportes y analíticas de citas.

---
© 2026 Heronova - Desarrollado por Erik Palacios.

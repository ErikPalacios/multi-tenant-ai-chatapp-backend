# Heronova AI - Multi-Tenant Backend 🚀

> [!WARNING]
> 🚧 **Work in Progress (WIP)** 🚧
> This project is currently under active development.

Heronova is a powerful and scalable backend platform designed to manage multi-tenant AI chatbots with **WhatsApp** integration. It is optimized for appointment automation, service management, and automated customer support.

## ✨ Key Features

- **Multi-Tenant Architecture**: Complete data isolation per business.
- **JWT Authentication System**: Owner registration, employee management, and protected roles.
- **Advanced Appointment Engine**: Dynamic availability calculation based on days, shifts (Morning/Afternoon/Night), and time slots.
- **Proprietary Finite State Machine (FSM)**: Robust and persistent conversational flows.
- **Messaging Integrations**: Support for WhatsApp Official API (Meta) and WATI.
- **Real-Time Persistence**: Deep integration with Firebase Firestore.
- **Concurrency Protection**: Slot locking system to prevent double bookings.

## 🛠️ Tech Stack

- **Language:** TypeScript / Node.js
- **Framework:** Express
- **Database:** Firebase Firestore (Admin SDK)
- **Security:** JWT (jsonwebtoken) & Hashing (bcrypt)
- **Testing:** Vitest

## 🚀 Installation and Usage

### 1. Clone the repository
```bash
git clone https://github.com/Erik7u7-n8n/multi-tenant-ai-chatapp-backend.git
cd multi-tenant-ai-chatapp-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
Ensure you configure your Firebase credentials and `JWT_SECRET`.

### 4. Run Tests
```bash
npm run test
```

## 📂 Project Structure

- `src/api`: Controllers and Middlewares (System entry point).
- `src/core`: Core logic (Orchestrator, FSM, Guards).
- `src/domains`: Domain services (Appointments, Users, Businesses).
- `src/integrations`: External connections (Firebase, WhatsApp).
- `src/interfaces`: Type definitions and contracts.

## 📝 Roadmap (To-Do)

- [ ] Web Dashboard for business owners.
- [ ] Integration with advanced AI models (Langchain/OpenAI).
- [ ] Automated WhatsApp reminders.
- [ ] Appointment analytics and reporting.

---
© 2026 Heronova - Developed by Erik Palacios.

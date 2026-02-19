import express from 'express';
import cors from 'cors';
import { WebhookController } from './api/controllers/WebhookController.js';
import { AuthController } from './api/controllers/AuthController.js';
import { authMiddleware, requireRole } from './api/middlewares/auth.middleware.js';

const app = express();


app.use(cors());
app.use(express.json());

// Public Routes
app.post('/webhook', WebhookController.handleWebhook);
app.post('/auth/register-owner', AuthController.registerOwner);
app.post('/auth/login', AuthController.login);

// Protected Routes
app.get('/me', authMiddleware, AuthController.getMe);
app.get('/employees', authMiddleware, requireRole(['OWNER']), AuthController.getEmployees);
app.post('/employees', authMiddleware, requireRole(['OWNER']), AuthController.createEmployee);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

export { app };

// File description:
// This file is the entry point of the application.
// It is responsible for starting the server and listening for incoming requests.
// It also defines the routes for the application.
// It also defines the health check endpoint.

// The api calls are:
// POST /webhook
// GET /health
import express from 'express';
import cors from 'cors';
import { WebhookController } from './api/controllers/WebhookController.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.post('/webhook', WebhookController.handleWebhook);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

export { app };

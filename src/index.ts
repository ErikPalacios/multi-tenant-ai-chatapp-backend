import dotenv from 'dotenv';
import { app } from './app.js';
import { FlowTemplateService } from './domains/flow/FlowTemplateService.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await FlowTemplateService.seedInitialTemplates();
    } catch (error) {
        console.error('Failed to seed initial templates:', error);
    }

    app.listen(PORT, () => {
        console.log(`====================================`);
        console.log(` Heronova Bot Backend is running `);
        console.log(` Port: ${PORT}                  `);
        console.log(` Mode: Production-ready         `);
        console.log(`====================================`);
    });
}

startServer();
// File description:
// This file is the entry point of the application.
// It is responsible for starting the server and listening for incoming requests.

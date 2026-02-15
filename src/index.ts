import dotenv from 'dotenv';
import { app } from './app.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`====================================`);
    console.log(` Heronova Bot Backend is running `);
    console.log(` Port: ${PORT}                  `);
    console.log(` Mode: Production-ready         `);
    console.log(`====================================`);
});
// File description:
// This file is the entry point of the application.
// It is responsible for starting the server and listening for incoming requests.

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const WATI_TOKEN = process.env.WATI_TOKEN;
const WATI_API_URL = process.env.WATI_API_URL;

export class WatiService {
    static async sendMessage(waId: string, text: string): Promise<void> {
        try {
            console.log(`Sending message to ${waId}: ${text}`);
            // In a real scenario, we would use WATI's endpoint
            // await axios.post(`${WATI_API_URL}/api/v1/sendSessionMessage/${waId}`, 
            //     { messageText: text }, 
            //     { headers: { Authorization: WATI_TOKEN } }
            // );
        } catch (error) {
            console.error('Error sending message via WATI:', error);
        }
    }

    static async sendTemplate(waId: string, templateName: string, parameters: any[]): Promise<void> {
        // Implementation for sending WATI templates
    }
}

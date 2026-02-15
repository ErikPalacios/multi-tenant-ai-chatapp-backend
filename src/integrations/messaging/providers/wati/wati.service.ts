import axios from 'axios';
import dotenv from 'dotenv';
import { MessageButton, MessageList } from './wati.models.js';

dotenv.config();

const WATI_TOKEN = process.env.WATI_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImFnZW5jaWF6b29tbXR5QGdtYWlsLmNvbSIsIm5hbWVpZCI6ImFnZW5jaWF6b29tbXR5QGdtYWlsLmNvbSIsImVtYWlsIjoiYWdlbmNpYXpvb21tdHlAZ21haWwuY29tIiwiYXV0aF90aW1lIjoiMDEvMjcvMjAyNiAyMDozMDozOSIsInRlbmFudF9pZCI6IjEwNDQ2MjkiLCJkYl9uYW1lIjoibXQtcHJvZC1UZW5hbnRzIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQURNSU5JU1RSQVRPUiIsImV4cCI6MjUzNDAyMzAwODAwLCJpc3MiOiJDbGFyZV9BSSIsImF1ZCI6IkNsYXJlX0FJIn0.VFUNx7a0cIfDrjbMLit0yDCmq19m_QzB4i8nxo6ZFRY';
const WATI_API_URL = process.env.WATI_API_URL || 'https://live-mt-server.wati.io/1044629';

export class WatiService {
    /**
     * Sends a simple text message.
     * Note: WATI also allows sending text via query parameters as seen in your previous version.
     */
    static async sendMessage(waId: string, text: string, config: { token: string, url: string }): Promise<void> {
        try {
            const axiosConfig = {
                method: 'post',
                url: `${config.url}/api/v1/sendSessionMessage/${waId}`,
                headers: {
                    'Authorization': `Bearer ${config.token}`,
                    'Content-Type': 'application/json'
                },
                data: { messageText: text } // <--- EL BODY SE ESCRIBE AQUÍ (propiedad 'data')
            };

            const response = await axios(axiosConfig);
            console.log('WhatsApp API Response (Text):', JSON.stringify(response.data));
        } catch (error: any) {
            console.error('Error sending WhatsApp text message:', error.response?.data || error.message);
        }
    }

    /**
     * Sends interactive buttons using the MessageButton model.
     */
    static async sendInteractiveButtons(waId: string, text: string, buttons: string[], config: { token: string, url: string }): Promise<void> {
        try {
            const body = MessageButton(waId, text, buttons);

            const axiosConfig = {
                method: 'post',
                url: `${config.url}/api/v1/sendInteractiveButtonsMessage/${waId}`,
                headers: {
                    'Authorization': `Bearer ${config.token}`,
                    'Content-Type': 'application/json'
                },
                data: body // <--- Se pasa el objeto del modelo aquí
            };

            const response = await axios(axiosConfig);
            console.log('WhatsApp API Response (Buttons):', JSON.stringify(response.data));
        } catch (error: any) {
            console.error('Error sending WhatsApp buttons:', error.response?.data || error.message);
        }
    }

    /**
     * Sends an interactive list using the MessageList model.
     */
    static async sendInteractiveList(waId: string, text: string, title: string, buttonText: string, rows: { title: string, description?: string }[], config: { token: string, url: string }): Promise<void> {
        try {
            const body = MessageList(waId, text, title, buttonText, rows);

            const axiosConfig = {
                method: 'post',
                url: `${config.url}/api/v1/sendInteractiveListMessage/${waId}`,
                headers: {
                    'Authorization': `Bearer ${config.token}`,
                    'Content-Type': 'application/json'
                },
                data: body // <--- Se pasa el objeto del modelo aquí
            };

            const response = await axios(axiosConfig);
            console.log('WhatsApp API Response (List):', JSON.stringify(response.data));
        } catch (error: any) {
            console.error('Error sending WhatsApp list:', error.response?.data || error.message);
        }
    }
}

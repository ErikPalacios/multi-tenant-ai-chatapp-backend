import axios from 'axios';
import { MessageText, MessageButton, MessageList } from './whatsapp.models.js';

export class WhatsAppService {
    /**
     * Sends a simple text message via Meta API.
     */
    static async sendMessage(waId: string, text: string, config: { token: string, phoneNumberId: string }): Promise<void> {
        try {
            const body = MessageText(waId, text);

            const axiosConfig = {
                method: 'post',
                url: `https://graph.facebook.com/v21.0/${config.phoneNumberId}/messages`,
                headers: {
                    'Authorization': `Bearer ${config.token}`,
                    'Content-Type': 'application/json'
                },
                data: body
            };

            const response = await axios(axiosConfig);
            console.log('WhatsApp Meta API Response (Text):', JSON.stringify(response.data));
        } catch (error: any) {
            console.error('Error sending WhatsApp Meta text message:', error.response?.data || error.message);
        }
    }

    /**
     * Sends interactive buttons via Meta API.
     */
    static async sendInteractiveButtons(waId: string, text: string, buttons: string[], config: { token: string, phoneNumberId: string }): Promise<void> {
        try {
            const body = MessageButton(waId, text, buttons);

            const axiosConfig = {
                method: 'post',
                url: `https://graph.facebook.com/v21.0/${config.phoneNumberId}/messages`,
                headers: {
                    'Authorization': `Bearer ${config.token}`,
                    'Content-Type': 'application/json'
                },
                data: body
            };

            const response = await axios(axiosConfig);
            console.log('WhatsApp Meta API Response (Buttons):', JSON.stringify(response.data));
        } catch (error: any) {
            console.error('Error sending WhatsApp Meta buttons:', error.response?.data || error.message);
        }
    }

    /**
     * Sends an interactive list via Meta API.
     */
    static async sendInteractiveList(waId: string, text: string, title: string, buttonText: string, rows: { title: string, description?: string }[], config: { token: string, phoneNumberId: string }): Promise<void> {
        try {
            const body = MessageList(waId, text, title, buttonText, rows);

            const axiosConfig = {
                method: 'post',
                url: `https://graph.facebook.com/v21.0/${config.phoneNumberId}/messages`,
                headers: {
                    'Authorization': `Bearer ${config.token}`,
                    'Content-Type': 'application/json'
                },
                data: body
            };

            const response = await axios(axiosConfig);
            console.log('WhatsApp Meta API Response (List):', JSON.stringify(response.data));
        } catch (error: any) {
            console.error('Error sending WhatsApp Meta list:', error.response?.data || error.message);
        }
    }
}

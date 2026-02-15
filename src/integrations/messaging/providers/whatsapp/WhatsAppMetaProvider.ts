import { IMessagingProvider } from '../../IMessagingProvider.js';
import { WhatsAppService } from './whatsapp.service.js';

export class WhatsAppMetaProvider implements IMessagingProvider {
    constructor(private config: { token: string, phoneNumberId: string }) { }

    async sendMessage(waId: string, text: string): Promise<void> {
        await WhatsAppService.sendMessage(waId, text, this.config);
    }

    async sendButtons(waId: string, text: string, buttons: string[]): Promise<void> {
        await WhatsAppService.sendInteractiveButtons(waId, text, buttons, this.config);
    }

    async sendList(waId: string, text: string, title: string, buttonText: string, rows: { title: string, description?: string }[]): Promise<void> {
        await WhatsAppService.sendInteractiveList(waId, text, title, buttonText, rows, this.config);
    }
}

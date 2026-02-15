import { IMessagingProvider } from '../../IMessagingProvider.js';
import { WatiService } from './wati.service.js';

export class WatiProvider implements IMessagingProvider {
    constructor(private config: { token: string, url: string }) { }

    async sendMessage(waId: string, text: string): Promise<void> {
        await WatiService.sendMessage(waId, text, this.config);
    }

    async sendButtons(waId: string, text: string, buttons: string[]): Promise<void> {
        await WatiService.sendInteractiveButtons(waId, text, buttons, this.config);
    }

    async sendList(waId: string, text: string, title: string, buttonText: string, rows: { title: string, description?: string }[]): Promise<void> {
        await WatiService.sendInteractiveList(waId, text, title, buttonText, rows, this.config);
    }
}

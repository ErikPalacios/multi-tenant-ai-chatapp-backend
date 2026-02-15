import { IMessagingProvider } from './IMessagingProvider.js';
import { WatiProvider } from './providers/wati/WatiProvider.js';
import { WhatsAppMetaProvider } from './providers/whatsapp/WhatsAppMetaProvider.js';

export class MessagingFactory {
    static getProvider(platform: string, config: any): IMessagingProvider {
        switch (platform) {
            case 'wati':
                return new WatiProvider({
                    token: config.token,
                    url: config.url
                });
            case 'meta':
                return new WhatsAppMetaProvider({
                    token: config.token,
                    phoneNumberId: config.phoneNumberId
                });
            default:
                throw new Error(`Platform ${platform} not supported`);
        }
    }
}

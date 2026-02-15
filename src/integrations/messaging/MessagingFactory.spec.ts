import { describe, it, expect, vi } from 'vitest';
import { MessagingFactory } from './MessagingFactory.js';
import { WatiProvider } from './providers/wati/WatiProvider.js';
import { WhatsAppMetaProvider } from './providers/whatsapp/WhatsAppMetaProvider.js';
import { WatiService } from './providers/wati/wati.service.js';
import { WhatsAppService } from './providers/whatsapp/whatsapp.service.js';

vi.mock('./providers/wati/wati.service.js');
vi.mock('./providers/whatsapp/whatsapp.service.js');

describe('Messaging System', () => {
    const waId = '12345';
    const text = 'Hello';

    describe('MessagingFactory', () => {
        it('should return a WatiProvider for platform "wati"', () => {
            const provider = MessagingFactory.getProvider('wati', { token: 'tok', url: 'url' });
            expect(provider).toBeInstanceOf(WatiProvider);
        });

        it('should return a WhatsAppMetaProvider for platform "meta"', () => {
            const provider = MessagingFactory.getProvider('meta', { token: 'tok', phoneNumberId: 'id' });
            expect(provider).toBeInstanceOf(WhatsAppMetaProvider);
        });

        it('should throw error for unsupported platform', () => {
            expect(() => MessagingFactory.getProvider('unknown', {})).toThrow('Platform unknown not supported');
        });
    });

    describe('WatiProvider', () => {
        const config = { token: 'tok', url: 'url' };
        const provider = new WatiProvider(config);

        it('should call WatiService.sendMessage', async () => {
            await provider.sendMessage(waId, text);
            expect(WatiService.sendMessage).toHaveBeenCalledWith(waId, text, config);
        });

        it('should call WatiService.sendInteractiveButtons', async () => {
            const buttons = ['Yes', 'No'];
            await provider.sendButtons(waId, text, buttons);
            expect(WatiService.sendInteractiveButtons).toHaveBeenCalledWith(waId, text, buttons, config);
        });

        it('should call WatiService.sendInteractiveList', async () => {
            const rows = [{ title: 'Row 1' }];
            await provider.sendList(waId, text, 'Title', 'Button', rows);
            expect(WatiService.sendInteractiveList).toHaveBeenCalledWith(waId, text, 'Title', 'Button', rows, config);
        });
    });

    describe('WhatsAppMetaProvider', () => {
        const config = { token: 'tok', phoneNumberId: 'id' };
        const provider = new WhatsAppMetaProvider(config);

        it('should call WhatsAppService.sendMessage', async () => {
            await provider.sendMessage(waId, text);
            expect(WhatsAppService.sendMessage).toHaveBeenCalledWith(waId, text, config);
        });

        it('should call WhatsAppService.sendInteractiveButtons', async () => {
            const buttons = ['Yes', 'No'];
            await provider.sendButtons(waId, text, buttons);
            expect(WhatsAppService.sendInteractiveButtons).toHaveBeenCalledWith(waId, text, buttons, config);
        });

        it('should call WhatsAppService.sendInteractiveList', async () => {
            const rows = [{ title: 'Row 1' }];
            await provider.sendList(waId, text, 'Title', 'Button', rows);
            expect(WhatsAppService.sendInteractiveList).toHaveBeenCalledWith(waId, text, 'Title', 'Button', rows, config);
        });
    });
});

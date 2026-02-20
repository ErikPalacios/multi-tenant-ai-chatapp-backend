import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { WebhookController } from './WebhookController.js';
import { TenantService } from '../../services/TenantService.js';
import { FirebaseService } from '../../integrations/firebase/firebase.service.js';
import { AIService } from '../../integrations/ai/ai.service.js';
import { SupportGuard } from '../../core/guards/SupportGuard.js';
import { FSMOrchestrator } from '../../core/fsm/Orchestrator.js';
import { WatiService } from '../../integrations/messaging/providers/wati/wati.service.js';
import admin from 'firebase-admin';
import { MessagingFactory } from '../../integrations/messaging/MessagingFactory.js';

// Mocks
vi.mock('../../services/TenantService.js');
vi.mock('../../integrations/firebase/firebase.service.js');
vi.mock('../../integrations/ai/ai.service.js');
vi.mock('../../core/guards/SupportGuard.js');
vi.mock('../../core/fsm/Orchestrator.js');
vi.mock('../../integrations/wati/wati.service.js');
vi.mock('firebase-admin', () => {
    const mockFirestore = {
        collection: vi.fn().mockReturnThis(),
        doc: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        get: vi.fn().mockResolvedValue({
            exists: true,
            data: () => ({ watiToken: 'test-token', watiApiUrl: 'test-url' }),
            docs: []
        }),
        set: vi.fn().mockResolvedValue({}),
        runTransaction: vi.fn(),
        settings: vi.fn()
    };
    return {
        default: {
            apps: [],
            initializeApp: vi.fn(),
            credential: {
                applicationDefault: vi.fn()
            },
            firestore: vi.fn(() => mockFirestore)
        }
    };
});
vi.mock('../../integrations/messaging/MessagingFactory.js');

const messagingProviderMock = {
    sendMessage: vi.fn(),
    sendButtons: vi.fn(),
    sendList: vi.fn()
};
(MessagingFactory.getProvider as any).mockReturnValue(messagingProviderMock);

const app = express();
app.use(express.json());
app.post('/webhook', WebhookController.handleWebhook);

describe('WebhookController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should handle a valid webhook request', async () => {
        // Setup mocks
        vi.mocked(TenantService.resolveBusiness).mockResolvedValue({
            businessId: 'test-biz',
            platform: 'wati'
        });
        vi.mocked(TenantService.getEmployee).mockResolvedValue(null as any);
        vi.mocked(FirebaseService.getCustomer).mockResolvedValue({
            waId: '12345',
            businessId: 'test-biz',
            name: 'Test User',
            status: 'IDLE',
            humanSupportActive: false,
            lastInteraction: new Date()
        });
        vi.mocked(FirebaseService.getSession).mockResolvedValue({
            waId: '12345',
            businessId: 'test-biz',
            state: 'IDLE',
            memory: {},
            expiresAt: new Date(Date.now() + 10000)
        });
        vi.mocked(SupportGuard.isHumanSupportActive).mockReturnValue(false);
        vi.mocked(AIService.classifyIntent).mockResolvedValue('Saludo' as any);
        vi.mocked(FSMOrchestrator.process).mockResolvedValue({
            newState: 'SELECT_SERVICE',
            responseMessages: ['Hola! ¿En qué puedo ayudarte?']
        });

        const response = await request(app)
            .post('/webhook')
            .send({
                waId: '12345',
                text: 'Hola',
                senderName: 'Test User'
            });

        expect(messagingProviderMock.sendMessage).toHaveBeenCalledWith('12345', 'Hola! ¿En qué puedo ayudarte?');
    });

    it('should ignore request if human support is active', async () => {
        vi.mocked(TenantService.resolveBusiness).mockResolvedValue({
            businessId: 'test-biz',
            platform: 'wati'
        });
        vi.mocked(TenantService.getEmployee).mockResolvedValue(null as any);
        vi.mocked(FirebaseService.getCustomer).mockResolvedValue({
            waId: '12345',
            businessId: 'test-biz',
            name: 'Test User',
            status: 'IDLE',
            humanSupportActive: true,
            lastInteraction: new Date()
        });
        vi.mocked(SupportGuard.isHumanSupportActive).mockReturnValue(true);

        const response = await request(app)
            .post('/webhook')
            .send({
                waId: '12345',
                text: 'Ayuda humana',
                senderName: 'Test User'
            });

        expect(response.status).toBe(200);
        expect(response.text).toBe('OK');
        expect(FSMOrchestrator.process).not.toHaveBeenCalled();
    });
});

import { Request, Response } from 'express';
import { TenantService } from '../../services/TenantService.js';
import { FSMOrchestrator } from '../../core/fsm/Orchestrator.js';
import { AIService } from '../../integrations/ai/ai.service.js';
import { SupportGuard } from '../../core/guards/SupportGuard.js';
import { WatiService } from '../../integrations/messaging/providers/wati/wati.service.js';
import { ChatMessage, ConversationContext } from '../../interfaces/index.js';
import admin from 'firebase-admin';
import { FirebaseService } from '../../integrations/firebase/firebase.service.js';
import { MessageParser } from '../../utils/MessageParser.js';
import { MessagingFactory } from '../../integrations/messaging/MessagingFactory.js';

export class WebhookController {
    /**
     * Handles incoming WATI webhooks.
     */
    static async handleWebhook(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body;
            console.log('Incoming Webhook:', JSON.stringify(body, null, 2));

            // 1. Resolve Tenant and employee
            const { businessId, platform } = await TenantService.resolveBusiness(req);
            console.log(`Resolved Business: ${businessId} on Platform: ${platform}`);

            const employeeId = await TenantService.getEmployee(businessId, req);
            console.log(`Resolved Employee: ${employeeId}`);


            // 2. Extract and Normalize Message
            const waId = body.waId;
            const customerRef = admin.firestore().doc(`businesses/${businessId}/customers/${waId}`);

            const rawChatMessage: ChatMessage = {
                message: body.text || '',
                nameOfSender: body.senderName,
                timeStamp: body.timestamp || new Date().toISOString(),
                uidOfSender: customerRef
            };

            // 3. Parse Code and Text
            const { code, text: messageText } = MessageParser.parse(rawChatMessage.message);

            // 4. Fetch or Create Customer
            let customerRes = await FirebaseService.getCustomer(businessId, waId);
            let customer: any;

            if (!customerRes) {
                customer = {
                    waId: waId,
                    businessId: businessId,
                    name: rawChatMessage.nameOfSender || 'Cliente',
                    status: 'IDLE' as const,
                    humanSupportActive: false,
                    lastInteraction: new Date()
                };
                await FirebaseService.logCustomer(businessId, customer);
            } else {
                customer = customerRes;
            }

            // 5. Fetch or Create Session
            let sessionRes = await FirebaseService.getSession(businessId, waId);
            let session: any;

            if (!sessionRes || (sessionRes.expiresAt && sessionRes.expiresAt < new Date())) {
                session = {
                    waId,
                    businessId,
                    state: 'IDLE' as const,
                    memory: {},
                    expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 min TTL
                };
            } else {
                session = sessionRes;
            }

            // 6. Guards (Human Support)
            if (SupportGuard.isHumanSupportActive(customer)) {
                console.log(`Human support active for ${customer.waId}. Ignoring.`);
                res.status(200).send('OK');
                return;
            }

            // 7. Intent Classification (Only if in IDLE or beginning flow)
            let intent;
            if (session.state === 'IDLE') {
                intent = await AIService.classifyIntent(messageText);
            }

            // 8. Context Creation
            const context: ConversationContext = {
                businessId,
                employeeId: session.memory.employeeId,
                platform,
                customer,
                session,
                message: { ...rawChatMessage, message: messageText },
                code,
                intent
            };

            // 8.1 Resolve Messaging Provider
            const businessDoc = await admin.firestore().doc(`businesses/${businessId}`).get();
            const businessData = businessDoc.data();
            const messagingConfig = {
                token: platform === 'wati' ? (businessData?.watiToken || process.env.WATI_TOKEN) : (businessData?.metaToken || process.env.META_TOKEN),
                url: businessData?.watiApiUrl || process.env.WATI_API_URL,
                phoneNumberId: businessData?.metaPhoneNumberId || process.env.META_PHONE_NUMBER_ID
            };

            const messagingProvider = MessagingFactory.getProvider(platform, messagingConfig);

            // 9. State Machine / FSM Processing
            const response = await FSMOrchestrator.process(context);

            // 10. Deliver User Responses
            for (const msg of response.responseMessages) {
                if (typeof msg === 'string') {
                    await messagingProvider.sendMessage(customer.waId, msg);
                } else {
                    switch (msg.type) {
                        case 'text':
                            await messagingProvider.sendMessage(customer.waId, msg.content);
                            break;
                        case 'buttons':
                            await messagingProvider.sendButtons(customer.waId, msg.content, msg.buttons);
                            break;
                        case 'list':
                            await messagingProvider.sendList(customer.waId, msg.content, msg.title, msg.buttonText, msg.rows);
                            break;
                    }
                }
            }

            res.status(200).send('OK');

        } catch (error) {
            console.error('Webhook processing error:', error);
            res.status(500).send('Internal error');
        }
    }
}
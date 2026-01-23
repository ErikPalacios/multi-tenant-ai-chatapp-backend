import { Request, Response } from 'express';
import { FirebaseService } from '../../integrations/firebase/firebase.service.js';
import { AIService } from '../../integrations/ai/ai.service.js';
import { SupportGuard } from '../../core/guards/SupportGuard.js';
import { StateMachine } from '../../core/state-machine/StateMachine.js';
import { WatiService } from '../../integrations/wati/wati.service.js';
import { Customer, WatiMessage, ConversationContext } from '../../interfaces/index.js';

export class WebhookController {
    /**
     * Handles incoming WATI webhooks.
     */
    static async handleWebhook(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body;
            console.log('Incoming Webhook Body:', JSON.stringify(body, null, 2));

            // 1. Extract and normalize message
            const rawMessage: WatiMessage = {
                waId: body.waId,
                text: body.text || '',
                type: body.type,
                timestamp: body.timestamp,
                senderName: body.senderName,
                listReply: body.listReply,
                buttonReply: body.buttonReply
            };

            // Requirement 8: Separate "codigo: mensaje"
            let messageText = rawMessage.text;
            if (messageText.includes(':')) {
                const parts = messageText.split(':');
                const code = parts[0].trim();
                const actualText = parts.slice(1).join(':').trim();
                console.log(`Extracted Code: ${code}, Text: ${actualText}`);
                messageText = actualText;
            }

            // 2. Fetch or Create Customer
            let customer = await FirebaseService.getCustomer(rawMessage.waId);
            if (!customer) {
                customer = {
                    waId: rawMessage.waId,
                    name: rawMessage.senderName || 'Cliente',
                    status: 'nuevo',
                    humanSupportActive: false,
                    lastInteraction: new Date()
                };
                await FirebaseService.saveCustomer(customer);
            }

            // 3. Persist incoming message
            await FirebaseService.logMessage(customer.waId, rawMessage);

            // 4. Support Guard
            if (SupportGuard.isHumanSupportActive(customer)) {
                console.log(`Human support active for ${customer.waId}. Ignoring message.`);
                res.status(200).send('Support Active');
                return;
            }

            // 5. Intent Classification (if state is new)
            let intent;
            if (customer.status === 'nuevo' || customer.status === 'activo') {
                intent = await AIService.classifyIntent(messageText);
            }

            // 6. Process through State Machine
            const context: ConversationContext = {
                customer,
                message: { ...rawMessage, text: messageText },
                intent
            };

            const response = await StateMachine.process(context);

            // 7. Deliver Responses
            for (const msg of response.responseMessages) {
                await WatiService.sendMessage(customer.waId, msg);
            }

            // 8. Persist final state and side effects
            // (Handling of side effects like confirming appointments would go here)

            res.status(200).send('OK');

        } catch (error) {
            console.error('CRITICAL ERROR in Webhook Controller:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

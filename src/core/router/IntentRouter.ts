import { ConversationContext, DomainResponse } from "../../interfaces/index.js";
import { AppointmentsDomain } from "../../domains/appointments/AppointmentsDomain.js";
import { AIService } from "../../integrations/ai/ai.service.js";

export class IntentRouter {
    /**
     * Routes the message to the corresponding domain based on intent and state.
     */
    static async route(ctx: ConversationContext): Promise<DomainResponse> {
        const { customer, intent } = ctx;

        // Priority 1: State-based routing
        if (customer.status === 'citas' || customer.status === 'reagendando') {
            return await AppointmentsDomain.handle(ctx);
        }

        // Priority 2: Intent-based routing
        switch (intent) {
            case 'Citas':
            case 'Confirmacion':
            case 'Reagendar':
                return await AppointmentsDomain.handle(ctx);

            case 'Soporte':
                return {
                    newState: 'soporte',
                    responseMessages: ['Te pondré en contacto con un agente humano. Por favor, aguarda un momento.']
                };

            case 'Promociones':
                return {
                    newState: 'activo',
                    responseMessages: ['Actualmente tenemos un 20% de descuento en limpiezas dentales. ¿Te interesa?']
                };

            case 'FAQ':
            case 'Fallback':
                const ragResponse = await AIService.getRAGResponse(ctx.message.text);
                return {
                    newState: (customer.status === 'nuevo') ? 'activo' : customer.status,
                    responseMessages: [ragResponse]
                };

            case 'Saludo':
                return {
                    newState: 'activo',
                    responseMessages: ['¡Hola! ¿En qué puedo ayudarte hoy?']
                };

            default:
                return {
                    newState: 'fallback',
                    responseMessages: ['No estoy seguro de cómo ayudarte con eso. ¿Podrías ser más específico o prefieres hablar con un agente?']
                };
        }
    }
}

import { ConversationContext, DomainResponse } from "../../interfaces/index.js";

export class AppointmentsDomain {
    static async handle(ctx: ConversationContext): Promise<DomainResponse> {
        const { customer, message, intent } = ctx;
        const text = message.text.toLowerCase();

        // Flujo de confirmación/reagendamiento basado en el mensaje del usuario
        if (customer.status === 'citas' || intent === 'Confirmacion') {
            if (text.includes('si') || text.includes('confirmar')) {
                return {
                    newState: 'activo',
                    responseMessages: [
                        '¡Excelente! Tu cita ha sido confirmada.',
                        'Recuerda llegar 10 minutos antes. Te esperamos.'
                    ]
                };
            }
            if (text.includes('no') || text.includes('reagendar')) {
                return {
                    newState: 'reagendando',
                    responseMessages: [
                        'Entiendo. ¿Para qué fecha te gustaría reagendar tu cita?'
                    ]
                };
            }
        }

        if (customer.status === 'reagendando') {
            return {
                newState: 'activo',
                responseMessages: [
                    'Perfecto, he recibido la solicitud de cambio. Un agente se pondrá en contacto para finalizar el proceso.'
                ]
            };
        }

        // Caso por defecto (Inicio de flujo de citas)
        return {
            newState: 'citas',
            responseMessages: [
                'Veo que quieres agendar o consultar una cita.',
                '¿Deseas confirmar tu cita actual o agendar una nueva?'
            ]
        };
    }
}

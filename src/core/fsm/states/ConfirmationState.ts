import { ConversationContext, DomainResponse } from '../../../interfaces/index.js';
import { State } from '../State.js';
import { AppointmentEngine } from '../../../domains/appointments/AppointmentEngine.js';
import { FirebaseService } from '../../../integrations/firebase/firebase.service.js';
import {
    ASK_TIME_AGAIN_MESSAGE,
    NO_APPOINTMENT_MESSAGE,
    COMPLETED_APPOINTMENT_MESSAGE,
    CONFIRMATION_APPOINTMENT_BY_USER,
    CANCEL_APPOINTMENT_BY_USER
} from '../../../constants/messages.js';

export class ConfirmationState implements State {
    async handle(ctx: ConversationContext): Promise<DomainResponse> {
        const text = ctx.message.message; // Removed toLowerCase() to match button text exactly if needed, or we can use includes

        if (text.includes(CONFIRMATION_APPOINTMENT_BY_USER)) {
            const { serviceId, date, time, customerName } = ctx.session.memory;

            const services = await FirebaseService.getServices(ctx.businessId);
            const service = services.find(s => s.id === serviceId);

            if (!service) {
                return {
                    newState: 'IDLE',
                    responseMessages: ['Hubo un problema al confirmar. Por favor inicia de nuevo.']
                };
            }

            const appointment = await AppointmentEngine.bookAppointment(ctx.businessId, {
                waId: ctx.customer.waId,
                service,
                date,
                time,
                customerName
            });

            if (!appointment) {
                return {
                    newState: 'SELECT_TIME',
                    responseMessages: [
                        ASK_TIME_AGAIN_MESSAGE
                    ]
                };
            }

            return {
                newState: 'COMPLETED',
                responseMessages: [
                    COMPLETED_APPOINTMENT_MESSAGE
                ],
                memoryUpdate: {
                    lastFolio: appointment.folio
                }
            };
        }

        if (text.includes(CANCEL_APPOINTMENT_BY_USER)) {
            return {
                newState: 'IDLE',
                responseMessages: [NO_APPOINTMENT_MESSAGE]
            };
        }

        // Default prompt with buttons
        return {
            newState: 'CONFIRMATION',
            responseMessages: [
                {
                    type: 'buttons',
                    content: 'Por favor confirma los detalles de tu cita para finalizar.',
                    buttons: [CONFIRMATION_APPOINTMENT_BY_USER, CANCEL_APPOINTMENT_BY_USER]
                }
            ]
        };
    }
}

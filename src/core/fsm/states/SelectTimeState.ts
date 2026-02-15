import { ConversationContext, DomainResponse } from '../../../interfaces/index.js';
import { State } from '../State.js';
import { AppointmentEngine } from '../../../domains/appointments/AppointmentEngine.js';
import { TenantService } from '../../../services/TenantService.js';
import { FirebaseService } from '../../../integrations/firebase/firebase.service.js';
import {
    ASK_NAME_MESSAGE, ASK_SERVICE_MESSAGE,
    ASK_TIME_AGAIN_MESSAGE, ASK_TURN_MESSAGE,
    BACK_TO_TIME_MESSAGE,
    BACK_TO_TURN_MESSAGE, BUTTON_DAYS_MESSAGE, BUTTON_SERVICES_MESSAGE,
    BUTTON_TIME_MESSAGE,
    CANCEL_PROCESS_MESSAGE,
    CUTOFF_TIME, DESCRIPTION_DAYS_MESSAGE, DESCRIPTION_TIME_MESSAGE, TITLE_DAYS_MESSAGE, TITLE_SERVICES_MESSAGE,
    TITLE_TIME_MESSAGE
} from '../../../constants/messages.js';


// Get time, ask for name.
export class SelectTimeState implements State {
    async handle(ctx: ConversationContext): Promise<DomainResponse> {
        const text = ctx.message.message.trim();
        const { date, serviceId, turn } = ctx.session.memory;

        const config = await TenantService.getBusinessConfig(ctx.businessId);
        const services = await FirebaseService.getServices(ctx.businessId);
        const service = services.find(s => s.id === serviceId);

        const availableSlots = await AppointmentEngine.getAvailableSlotsByTurn(ctx.businessId, config, serviceId, date, turn, ctx.session.memory.maxTurnsPerDay.length);

        if (!availableSlots.includes(text)) {
            return {
                newState: 'SELECT_TIME',
                responseMessages: [
                    {
                        type: 'list',
                        content: ASK_TIME_AGAIN_MESSAGE,
                        title: TITLE_DAYS_MESSAGE,
                        buttonText: BUTTON_DAYS_MESSAGE,
                        rows: availableSlots.slice(0, 10).map(slot => ({
                            title: slot,
                            description: DESCRIPTION_DAYS_MESSAGE
                        }))
                    }
                ]
            };
        }

        // Manage no service  

        if (!service) {
            return {
                newState: 'SELECT_SERVICE',
                responseMessages: [
                    {
                        type: 'list',
                        content: ASK_SERVICE_MESSAGE,
                        title: TITLE_SERVICES_MESSAGE,
                        buttonText: BUTTON_SERVICES_MESSAGE,
                        rows: services.map(s => ({
                            title: s.name,
                            description: s.price ? `$${s.price}` : undefined
                        }))
                    }
                ]
            };
        }

        if (text.includes(BACK_TO_TIME_MESSAGE)) {
            const availableSlots = await AppointmentEngine.getAvailableSlotsByTurn(ctx.businessId, config, serviceId, date, turn, ctx.session.memory.maxTurnsPerDay.length);
            return {
                newState: 'SELECT_TIME',
                responseMessages: [
                    {
                        type: 'list',
                        content: ASK_TIME_AGAIN_MESSAGE,
                        title: TITLE_TIME_MESSAGE,
                        buttonText: BUTTON_TIME_MESSAGE,
                        rows: availableSlots.slice(0, 10).map(slot => ({
                            title: slot,
                            description: DESCRIPTION_TIME_MESSAGE
                        }))
                    }
                ],
            };
        };

        return {
            newState: 'COLLECT_NAME',
            responseMessages: [
                {
                    type: 'list',
                    content: ASK_NAME_MESSAGE,
                    title: ASK_NAME_MESSAGE,
                    buttonText: ASK_NAME_MESSAGE,
                    rows: [
                        {
                            title: BACK_TO_TIME_MESSAGE,
                            description: BACK_TO_TIME_MESSAGE
                        },
                        {
                            title: CANCEL_PROCESS_MESSAGE,
                            description: CANCEL_PROCESS_MESSAGE
                        }
                    ]
                }
            ],
            memoryUpdate: {
                customerName: undefined
            }
        };



    }
}

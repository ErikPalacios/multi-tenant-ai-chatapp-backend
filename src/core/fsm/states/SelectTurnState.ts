import {
    ASK_DAY_AGAIN_MESSAGE, ASK_DAY_MESSAGE, ASK_TIME_MESSAGE, ASK_TURN_AGAIN_MESSAGE,
    ASK_TURN_MESSAGE, BACK_TO_DAY_MESSAGE, BUTTON_DAYS_MESSAGE, BUTTON_TURN_MESSAGE,
    DESCRIPTION_DAYS_MESSAGE, DESCRIPTION_TURN_MESSAGE, TITLE_DAYS_MESSAGE, TITLE_TURN_MESSAGE
} from '../../../constants/messages.js';
import { AppointmentEngine } from '../../../domains/appointments/AppointmentEngine.js';
import { ConversationContext, DomainResponse } from '../../../interfaces/index.js';
import { State } from '../State.js';
import { TenantService } from '../../../services/TenantService.js';
import { FirebaseService } from '../../../integrations/firebase/firebase.service.js';

export class SelectTurnState implements State {
    async handle(ctx: ConversationContext): Promise<DomainResponse> {
        const text = ctx.message.message.toLowerCase();
        const config = await TenantService.getBusinessConfig(ctx.businessId);

        const selectedServiceId = ctx.session.memory.serviceId;
        const selectedDate = ctx.session.memory.date;

        const selectedService = (await FirebaseService.getServices(ctx.businessId)).find(s => s.id === selectedServiceId);
        if (!selectedService) {
            return {
                newState: 'SELECT_SERVICE',
                responseMessages: ['Servicio no encontrado. Por favor, elige un servicio válido.']
            };
        }

        const turns = (await AppointmentEngine.getAvailableTurns(ctx.businessId, config, selectedService, selectedDate)) || [];

        if (!turns.includes(text)) {
            return {
                newState: 'SELECT_TURN',
                responseMessages: [
                    {
                        type: 'list',
                        content: ASK_TURN_MESSAGE,
                        title: TITLE_TURN_MESSAGE,
                        buttonText: BUTTON_TURN_MESSAGE,
                        rows: turns.slice(0, 10).map(turn => ({
                            title: turn,
                            description: DESCRIPTION_TURN_MESSAGE
                        }))
                    }
                ],
            }
        };

        if (text.includes(BACK_TO_DAY_MESSAGE)) {
            const availableDays = await AppointmentEngine.getAvailableDays(ctx.businessId, config, selectedService);
            return {
                newState: 'SELECT_DAY',
                responseMessages: [
                    {
                        type: 'list',
                        content: ASK_DAY_AGAIN_MESSAGE,
                        title: TITLE_DAYS_MESSAGE,
                        buttonText: BUTTON_DAYS_MESSAGE,
                        rows: availableDays.slice(0, 10).map(day => ({
                            title: day,
                            description: DESCRIPTION_DAYS_MESSAGE
                        }))
                    }
                ]
            };
        };

        const targetDateObj = new Date(selectedDate + 'T00:00:00');
        const maxTurns = config.maxTurnsPerDay ? config.maxTurnsPerDay[targetDateObj.getDay()] || 1 : 1;

        const getAvailableSlots = await AppointmentEngine.getAvailableSlotsByTurn(ctx.businessId, config, selectedService, selectedDate, text, maxTurns);

        if (!getAvailableSlots || !getAvailableSlots.length) {
            return {
                newState: 'SELECT_TURN',
                responseMessages: [
                    {
                        type: 'list',
                        content: ASK_TURN_AGAIN_MESSAGE,
                        title: TITLE_TURN_MESSAGE,
                        buttonText: BUTTON_TURN_MESSAGE,
                        rows: turns.slice(0, 10).map(turn => ({
                            title: turn,
                            description: DESCRIPTION_TURN_MESSAGE
                        }))
                    }
                ],
            }
        };

        return {
            newState: 'SELECT_TIME',
            responseMessages: [
                {
                    type: 'list',
                    content: ASK_TIME_MESSAGE,
                    title: TITLE_DAYS_MESSAGE,
                    buttonText: BUTTON_DAYS_MESSAGE,
                    rows: getAvailableSlots.slice(0, 10).map(slot => ({
                        title: slot,
                        description: DESCRIPTION_DAYS_MESSAGE
                    }))
                }
            ],
            memoryUpdate: {
                turn: text
            }
        };
    };
}

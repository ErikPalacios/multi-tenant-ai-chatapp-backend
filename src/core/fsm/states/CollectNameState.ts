import { APPOINTMENT_COMPLETE_MESSAGE, ASK_NAME_AGAIN_MESSAGE, ASK_NAME_MESSAGE, ASK_TIME_MESSAGE, BACK_TO_NAME_MESSAGE, BACK_TO_TIME_MESSAGE, CANCEL_PROCESS_MESSAGE, CONFIRMATION_APPOINTMENT_MESSAGE, REQUEST_NAME_AGAIN_MESSAGE } from '../../../constants/messages.js';
import { AppointmentEngine } from '../../../domains/appointments/AppointmentEngine.js';
import { Appointment, ConversationContext, DomainResponse } from '../../../interfaces/index.js';
import { State } from '../State.js';

export class CollectNameState implements State {
    async handle(ctx: ConversationContext): Promise<DomainResponse> {
        const name = ctx.message.message.trim();

        if (name.length < 3) {
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
                ]
            };
        }

        if (name.includes(BACK_TO_NAME_MESSAGE)) {
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
                ]
            };
        }

        const { serviceId, serviceName, date, time } = ctx.session.memory;

        const confirmMessage = `Estás a punto de agendar: ${serviceName} el ${date} a las ${time}. ¿Confirmas la cita?`;

        return {
            newState: 'CONFIRMATION',
            responseMessages: [
                {
                    type: 'list',
                    content: confirmMessage,
                    title: 'Confirmar Cita',
                    buttonText: 'Confirmar',
                    rows: [
                        {
                            title: 'Sí, agendar',
                            description: 'Confirmar cita'
                        },
                        {
                            title: 'Cancelar',
                            description: 'Cancelar proceso'
                        }
                    ]
                }
            ],
            memoryUpdate: {
                customerName: name
            }
        };
    }
}

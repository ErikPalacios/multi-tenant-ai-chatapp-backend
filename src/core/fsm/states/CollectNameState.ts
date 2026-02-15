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

        const { serviceName, date, time } = ctx.session.memory;
        const completeMessage = APPOINTMENT_COMPLETE_MESSAGE.replace('{{serviceName}}', serviceName).replace('{{date}}', date).replace('{{time}}', time);

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

        const appointment: Appointment = {
            id: await AppointmentEngine.generateFolio(),
            businessId: ctx.session.businessId,
            customerId: ctx.session.waId,
            serviceId: ctx.session.memory.serviceId,
            serviceName: ctx.session.memory.serviceName,
            date: ctx.session.memory.date,
            time: ctx.session.memory.time,
            name: name,
            status: 'pending',
            folio: '',
            createdAt: new Date(),
            employeeId: ctx.session.memory.employeeId,
            // commissionAmount: ctx.session.memory.commissionAmount, // La comisión solo se debe entregar una vez que se haya pagado el servicio
        };

        const result = await AppointmentEngine.bookAppointment(ctx.session.businessId, appointment);

        return {
            newState: 'COMPLETED',
            responseMessages: [
                {
                    type: 'list',
                    content: completeMessage,
                    title: completeMessage,
                    buttonText: completeMessage,
                    rows: [
                        {
                            title: REQUEST_NAME_AGAIN_MESSAGE,
                            description: REQUEST_NAME_AGAIN_MESSAGE
                        },
                        {
                            title: CANCEL_PROCESS_MESSAGE,
                            description: CANCEL_PROCESS_MESSAGE
                        }
                    ]
                }
            ],
            memoryUpdate: {
                name: name
            }
        };
    }
}

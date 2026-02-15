import { ConversationContext, DomainResponse } from '../../../interfaces/index.js';
import { State } from '../State.js';
import { FirebaseService } from '../../../integrations/firebase/firebase.service.js';
import { ASK_DAY_MESSAGE, BUTTON_DAYS_MESSAGE, BUTTON_SERVICES_MESSAGE, DESCRIPTION_DAYS_MESSAGE, NO_SERVICE_MESSAGE, TITLE_DAYS_MESSAGE, TITLE_SERVICES_MESSAGE } from '../../../constants/messages.js';
import { AppointmentEngine } from '../../../domains/appointments/AppointmentEngine.js';
import { TenantService } from '../../../services/TenantService.js';


export class SelectServiceState implements State {
    async handle(ctx: ConversationContext): Promise<DomainResponse> {
        const text = ctx.message.message.toLowerCase();
        const services = await FirebaseService.getServices(ctx.businessId);
        const config = await TenantService.getBusinessConfig(ctx.businessId);

        const selectedService = services.find(s =>
            text.includes(s.name.toLowerCase()) || text.includes(s.id.toLowerCase())
        );

        if (!selectedService) {
            return {
                newState: 'SELECT_SERVICE',
                responseMessages: [
                    {
                        type: 'list',
                        content: NO_SERVICE_MESSAGE,
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

        // Get available days
        const availableDays = await AppointmentEngine.getAvailableDays(ctx.businessId, config, selectedService);

        return {
            newState: 'SELECT_DAY',
            responseMessages: [
                {
                    type: 'list',
                    content: ASK_DAY_MESSAGE,
                    title: TITLE_DAYS_MESSAGE,
                    buttonText: BUTTON_DAYS_MESSAGE,
                    rows: availableDays.slice(0, 10).map(day => ({
                        title: day,
                        description: DESCRIPTION_DAYS_MESSAGE
                    }))
                }
            ],
            memoryUpdate: {
                serviceId: selectedService.id,
                serviceName: selectedService.name
            }
        };
    }
}

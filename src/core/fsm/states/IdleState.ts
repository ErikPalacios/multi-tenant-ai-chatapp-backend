import { INITIAL_ACTION, ASK_SERVICE_MESSAGE, WELCOME_MESSAGE, TITLE_SERVICES_MESSAGE, BUTTON_SERVICES_MESSAGE } from '../../../constants/messages.js';
import { FirebaseService } from '../../../integrations/firebase/firebase.service.js';
import { ConversationContext, DomainResponse } from '../../../interfaces/index.js';
import { State } from '../State.js';


export class IdleState implements State {
    async handle(ctx: ConversationContext): Promise<DomainResponse> {
        const { intent } = ctx;
        const services = await FirebaseService.getServices(ctx.businessId);
        const platform = ctx.platform;

        if (intent === 'Citas') {
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
        /////////////////////////////////
        // Classify message with AI
        // The classifier must return a responseMessage array
        /////////////////////////////////


        return {
            newState: 'AGENT_CLASSIFIER',
            responseMessages: [WELCOME_MESSAGE]
        };
    }
}

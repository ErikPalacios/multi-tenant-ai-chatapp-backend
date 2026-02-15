import { ConversationContext, DomainResponse, ConversationStatus } from '../../interfaces/index.js';
import { State } from './State.js';
import { IdleState } from './states/IdleState.js';
import { SelectServiceState } from './states/SelectServiceState.js';
import { SelectDayState } from './states/SelectDayState.js';
import { SelectTurnState } from './states/SelectTurnState.js';
import { SelectTimeState } from './states/SelectTimeState.js';
import { CollectNameState } from './states/CollectNameState.js';
import { ConfirmationState } from './states/ConfirmationState.js';
import { AgentClassifierState } from './states/AgentClassifierState.js';
import { FirebaseService } from '../../integrations/firebase/firebase.service.js';

export class FSMOrchestrator {
    private static states: Record<ConversationStatus, State> = {
        'IDLE': new IdleState(),
        'SELECT_SERVICE': new SelectServiceState(),
        'SELECT_DAY': new SelectDayState(),
        'SELECT_TURN': new SelectTurnState(),
        'SELECT_TIME': new SelectTimeState(),
        'COLLECT_NAME': new CollectNameState(),
        'CONFIRMATION': new ConfirmationState(),
        'COMPLETED': new IdleState(),
        'CANCELLED': new IdleState(),
        'soporte': new IdleState(),
        'fallback': new IdleState(),
        'AGENT_CLASSIFIER': new AgentClassifierState()
    };

    static async process(ctx: ConversationContext): Promise<DomainResponse> {
        const state = this.states[ctx.session.state] || this.states['IDLE'];

        try {
            const response = await state.handle(ctx);

            // Update session memory
            if (response.memoryUpdate) {
                ctx.session.memory = { ...ctx.session.memory, ...response.memoryUpdate };
            }

            // Update session state
            ctx.session.state = response.newState;

            // Persist session
            await FirebaseService.saveSession(ctx.businessId, ctx.session);

            return response;
        } catch (error) {
            console.error('FSM Error:', error);
            return {
                newState: 'IDLE',
                responseMessages: ['Lo siento, ocurrió un error en el flujo. ¿Podemos empezar de nuevo?']
            };
        }
    }
}

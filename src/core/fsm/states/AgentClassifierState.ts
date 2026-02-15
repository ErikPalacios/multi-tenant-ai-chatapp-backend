import { ConversationContext, DomainResponse } from '../../../interfaces/index.js';
import { State } from '../State.js';
import { SelectServiceState } from './SelectServiceState.js';

/**
 * AgentClassifierState handles the classification of the user's intent 
 * when they are not in a specific flow, routing them to the correct sub-agent or state.
 */
export class AgentClassifierState implements State {
    private selectServiceState = new SelectServiceState();

    async handle(ctx: ConversationContext): Promise<DomainResponse> {
        // If the user is responding to the service selection prompt, 
        // we delegate to SelectServiceState directly to avoid an extra turn.
        return this.selectServiceState.handle(ctx);
    }
}

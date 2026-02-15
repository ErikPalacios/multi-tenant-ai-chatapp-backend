import { ConversationContext, DomainResponse } from '../../interfaces/index.js';

export interface State {
    handle(ctx: ConversationContext): Promise<DomainResponse>;
}

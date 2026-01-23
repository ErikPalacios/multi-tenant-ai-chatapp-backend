import { ConversationContext, DomainResponse } from "../../interfaces/index.js";
import { IntentRouter } from "../router/IntentRouter.js";
import { FirebaseService } from "../../integrations/firebase/firebase.service.js";

export class StateMachine {
    /**
     * Processes the incoming message through the state machine and intent router.
     */
    static async process(ctx: ConversationContext): Promise<DomainResponse> {
        // Enforce state transition rules or special handlers here if needed
        // For now, we delegate to the IntentRouter which handles both state and intent

        const response = await IntentRouter.route(ctx);

        // Update customer state if it changed
        if (response.newState !== ctx.customer.status) {
            ctx.customer.status = response.newState;

            // Special case: activating human support
            if (response.newState === 'soporte') {
                ctx.customer.humanSupportActive = true;
            }

            await FirebaseService.saveCustomer(ctx.customer);
        }

        return response;
    }
}

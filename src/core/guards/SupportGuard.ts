import { Customer } from "../../interfaces/index.js";

export class SupportGuard {
    /**
     * Checks if the customer is currently in an active human support session.
     * If true, the bot should stay silent.
     */
    static isHumanSupportActive(customer: Customer): boolean {
        return customer.humanSupportActive === true;
    }
}

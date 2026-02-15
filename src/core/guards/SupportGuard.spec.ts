import { describe, it, expect } from 'vitest';
import { SupportGuard } from './SupportGuard.js';
import { Customer } from '../../interfaces/index.js';

describe('SupportGuard', () => {
    it('should return true if human support is active', () => {
        const customer: Partial<Customer> = {
            humanSupportActive: true
        };
        expect(SupportGuard.isHumanSupportActive(customer as Customer)).toBe(true);
    });

    it('should return false if human support is not active', () => {
        const customer: Partial<Customer> = {
            humanSupportActive: false
        };
        expect(SupportGuard.isHumanSupportActive(customer as Customer)).toBe(false);
    });

    it('should return false if human support is undefined', () => {
        const customer: Partial<Customer> = {
            humanSupportActive: undefined
        };
        expect(SupportGuard.isHumanSupportActive(customer as Customer)).toBe(false);
    });
});

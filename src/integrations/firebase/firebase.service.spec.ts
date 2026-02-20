import { describe, it, expect, vi, beforeEach } from 'vitest';
import admin from 'firebase-admin';
import { FirebaseService } from './firebase.service.js';

// Mocks
vi.mock('firebase-admin', () => {
    const mockFirestore = {
        collection: vi.fn().mockReturnThis(),
        doc: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        get: vi.fn(),
        set: vi.fn().mockResolvedValue({}),
        delete: vi.fn().mockResolvedValue({}),
        runTransaction: vi.fn(),
        settings: vi.fn()
    };
    return {
        default: {
            apps: [],
            initializeApp: vi.fn(),
            credential: {
                applicationDefault: vi.fn()
            },
            firestore: Object.assign(vi.fn(() => mockFirestore), {
                FieldValue: {
                    serverTimestamp: vi.fn(() => 'mock-timestamp')
                }
            })
        }
    };
});

describe('FirebaseService', () => {
    let mockDb: any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockDb = (admin.firestore as any)();
    });

    describe('getCustomer', () => {
        it('should return customer data if it exists', async () => {
            const mockData = { waId: '12345', name: 'Test User', lastInteraction: { toDate: () => new Date('2024-01-01') } };
            mockDb.get.mockResolvedValue({
                exists: true,
                data: () => mockData
            });

            const result = await FirebaseService.getCustomer('biz-1', '12345');
            expect(result).toEqual({
                ...mockData,
                lastInteraction: expect.any(Date)
            });
            expect(mockDb.collection).toHaveBeenCalledWith('businesses');
        });

        it('should return null if customer does not exist', async () => {
            mockDb.get.mockResolvedValue({ exists: false });
            const result = await FirebaseService.getCustomer('biz-1', '12345');
            expect(result).toBeNull();
        });
    });

    describe('logCustomer', () => {
        it('should call set with correct data and merge option', async () => {
            const customer = { waId: '12345', name: 'Test' } as any;
            await FirebaseService.logCustomer('biz-1', customer);

            expect(mockDb.set).toHaveBeenCalledWith(
                expect.objectContaining({
                    waId: '12345',
                    businessId: 'biz-1',
                    lastInteraction: 'mock-timestamp'
                }),
                { merge: true }
            );
        });
    });

    describe('getSession', () => {
        it('should return session data if it exists', async () => {
            const mockData = { waId: '12345', state: 'IDLE', expiresAt: { toDate: () => new Date('2024-01-01') } };
            mockDb.get.mockResolvedValue({
                exists: true,
                data: () => mockData
            });

            const result = await FirebaseService.getSession('biz-1', '12345');
            expect(result?.state).toBe('IDLE');
        });
    });

    describe('saveSession', () => {
        it('should call set with updated timestamp', async () => {
            const session = { waId: '12345', state: 'IDLE' } as any;
            await FirebaseService.saveSession('biz-1', session);
            expect(mockDb.set).toHaveBeenCalled();
        });
    });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TenantService } from './TenantService.js';
import admin from 'firebase-admin';

// Mocks
vi.mock('firebase-admin', () => {
    const mockFirestore = {
        collection: vi.fn().mockReturnThis(),
        doc: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        get: vi.fn()
    };
    return {
        default: {
            firestore: vi.fn(() => mockFirestore)
        }
    };
});

describe('TenantService', () => {
    let mockDb: any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockDb = (admin.firestore as any)();
    });

    describe('resolveBusiness', () => {
        it('should resolve business from destinationNumber', async () => {
            const mockReq = {
                body: { destinationNumber: '123456' }
            } as any;

            mockDb.get.mockResolvedValue({
                empty: false,
                docs: [{
                    id: 'biz-abc',
                    data: () => ({ platform: 'wati' })
                }]
            });

            const result = await TenantService.resolveBusiness(mockReq);

            expect(result).toEqual({
                businessId: 'biz-abc',
                platform: 'wati'
            });
            expect(mockDb.where).toHaveBeenCalledWith('phone', '==', '123456');
        });

        it('should return default-business if no matching phone is found', async () => {
            const mockReq = {
                body: { whatsappId: 'unknown' }
            } as any;

            mockDb.get.mockResolvedValue({ empty: true });

            const result = await TenantService.resolveBusiness(mockReq);

            expect(result.businessId).toBe('default-business');
        });

        it('should throw error if no identifier is present in body', async () => {
            const mockReq = { body: {} } as any;
            await expect(TenantService.resolveBusiness(mockReq)).rejects.toThrow('Business resolution failed');
        });
    });

    describe('getBusinessConfig', () => {
        it('should fetch config from the correct path', async () => {
            mockDb.get.mockResolvedValue({
                data: () => ({ some: 'config' })
            });

            const result = await TenantService.getBusinessConfig('biz-123');

            expect(result).toEqual({ some: 'config' });
            expect(mockDb.doc).toHaveBeenCalledWith('businesses/biz-123/configs/default');
        });
    });
});

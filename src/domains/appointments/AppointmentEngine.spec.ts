import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppointmentEngine } from './AppointmentEngine.js';
import { FirebaseService } from '../../integrations/firebase/firebase.service.js';
import { BusinessConfig, Service, Employee } from '../../interfaces/index.js';

vi.mock('../../integrations/firebase/firebase.service.js');

describe('AppointmentEngine', () => {
    const businessId = 'test-biz';
    const config: BusinessConfig = {
        workDays: [1, 2, 3, 4, 5], // Mon-Fri
        startTime: '09:00',
        endTime: '18:00',
        maxDaysFuture: 7,
        maxTurnsPerDay: { '1': 2, '2': 2, '3': 2, '4': 2, '5': 2, '6': 1, '0': 0 },
        slotsPerService: {},
        holidays: []
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        // Set a fixed date: Wednesday, May 22, 2024
        vi.setSystemTime(new Date('2024-05-22T10:00:00Z'));
    });

    describe('getAvailableDays', () => {
        const service: Service = {
            id: 'srv-1',
            businessId,
            name: 'Test Service',
            durationMinutes: 60,
            productOrService: 'service'
        };

        beforeEach(() => {
            vi.mocked(FirebaseService.getAppointmentsInRange).mockResolvedValue([]);
        });

        it('should return available days within maxDaysFuture', async () => {
            const days = await AppointmentEngine.getAvailableDays(businessId, config, service);
            expect(days).toHaveLength(5); // Mon-Fri within 7 days (Thu, Fri, Mon, Tue, Wed)
            expect(days[0]).toBe('2024-05-23'); // Thu
            expect(days[days.length - 1]).toBe('2024-05-29'); // Next Wed
        });

        it('should filter out non-working days', async () => {
            const restrictedConfig = { ...config, workDays: [1] }; // Only Mondays
            const days = await AppointmentEngine.getAvailableDays(businessId, restrictedConfig, service);
            expect(days).toHaveLength(1);
            expect(days[0]).toBe('2024-05-27'); // Next Monday
        });

        it('should filter out holidays', async () => {
            const configWithHoliday = { ...config, holidays: ['2024-05-23'] };
            const days = await AppointmentEngine.getAvailableDays(businessId, configWithHoliday, service);
            expect(days).not.toContain('2024-05-23');
            expect(days).toHaveLength(4);
        });

        it('should filter out days where the service is fully booked', async () => {
            // Mock appointments for May 23 such that all slots are taken
            // Slots: 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00 (End: 18:00)
            const fullDayAppointments: any[] = [
                '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
            ].map(time => ({
                businessId: businessId,
                customerId: 'user-123',
                serviceId: service.id,
                serviceName: service.name,
                date: '2024-05-23',
                time,
                status: 'pending',
                folio: 'folio',
                createdAt: new Date(),
                employeeId: 'employee-123',
                commissionAmount: 100

            }));

            vi.mocked(FirebaseService.getAppointmentsInRange).mockResolvedValue(fullDayAppointments);

            const days = await AppointmentEngine.getAvailableDays(businessId, config, service);
            expect(days).not.toContain('2024-05-23');
            expect(days).toHaveLength(4);
        });
    });

    describe('getAvailableSlots', () => {
        const service: Service = {
            id: 'srv-1',
            businessId,
            name: 'Test Service',
            durationMinutes: 60,
            productOrService: 'service'
        };

        it('should return slots where FirebaseService.checkAvailability is true', async () => {
            vi.mocked(FirebaseService.checkAvailability).mockResolvedValue(true);

            const date = '2024-05-23';
            const slots = await AppointmentEngine.getAvailableSlots(businessId, config, service, date);

            expect(slots).toContain('09:00');
            expect(slots).toContain('10:00');
            expect(slots).toContain('17:00');
            expect(slots).not.toContain('18:00'); // End time is exclusive
            expect(slots.length).toBe(9); // 09:00 to 17:00 hourly
        });

        it('should filter out unavailable slots', async () => {
            vi.mocked(FirebaseService.checkAvailability).mockImplementation(async (bizId, srvId, d, t) => {
                return t !== '10:00';
            });

            const date = '2024-05-23';
            const slots = await AppointmentEngine.getAvailableSlots(businessId, config, service, date);

            expect(slots).not.toContain('10:00');
            expect(slots).toContain('09:00');
            expect(slots.length).toBe(8);
        });
    });
    describe('getAvailableTurns', () => {
        const service: Service = {
            id: 'srv-1',
            businessId,
            name: 'Test Service',
            durationMinutes: 60,
            productOrService: 'service'
        };

        it('should return both morning and afternoon turns if slots are available in both', async () => {
            vi.mocked(FirebaseService.checkAvailability).mockResolvedValue(true);
            const date = '2024-05-23';
            const turns = await AppointmentEngine.getAvailableTurns(businessId, config, service, date);
            expect(turns).toContain('morning');
            expect(turns).toContain('afternoon');
        });

        it('should return only morning if only morning slots are available', async () => {
            vi.mocked(FirebaseService.checkAvailability).mockImplementation(async (b, s, d, t) => t < '13:00');
            const date = '2024-05-23';
            const turns = await AppointmentEngine.getAvailableTurns(businessId, config, service, date);
            expect(turns).toContain('morning');
            expect(turns).not.toContain('afternoon');
        });

        it('should return only afternoon if only afternoon slots are available', async () => {
            vi.mocked(FirebaseService.checkAvailability).mockImplementation(async (b, s, d, t) => t >= '13:00');
            const date = '2024-05-23';
            const turns = await AppointmentEngine.getAvailableTurns(businessId, config, service, date);
            expect(turns).not.toContain('morning');
            expect(turns).toContain('afternoon');
        });

        it('should return empty if no slots are available', async () => {
            vi.mocked(FirebaseService.checkAvailability).mockResolvedValue(false);
            const date = '2024-05-23';
            const turns = await AppointmentEngine.getAvailableTurns(businessId, config, service, date);
            expect(turns).toHaveLength(0);
        });
    });

    describe('bookAppointment', () => {
        const data = {
            waId: 'user-123',
            service: { id: 'srv-1', name: 'Manicura', durationMinutes: 30, price: 100 } as Service,
            date: '2024-05-25',
            time: '10:00',
            customerName: 'Erik'
        };

        it('should return null if lock cannot be acquired', async () => {
            vi.mocked(FirebaseService.acquireLock).mockResolvedValue(false);

            const result = await AppointmentEngine.bookAppointment(businessId, data);

            expect(result).toBeNull();
            expect(FirebaseService.saveAppointment).not.toHaveBeenCalled();
        });

        it('should create and save appointment if lock is acquired', async () => {
            vi.mocked(FirebaseService.acquireLock).mockResolvedValue(true);
            vi.mocked(FirebaseService.saveAppointment).mockResolvedValue(undefined);
            vi.mocked(FirebaseService.releaseLock).mockResolvedValue(undefined);

            const result = await AppointmentEngine.bookAppointment(businessId, data);

            expect(result).not.toBeNull();
            expect(result?.businessId).toBe(businessId);
            expect(result?.folio).toMatch(/^APP-[A-Z0-9]{6}$/);
            expect(FirebaseService.saveAppointment).toHaveBeenCalledWith(businessId, expect.anything());
            expect(FirebaseService.releaseLock).toHaveBeenCalled();
        });

        it('should calculate commission for employees', async () => {
            const employee: Employee = {
                id: 'emp-1',
                businessId,
                name: 'Employee',
                role: 'staff',
                isActive: true,
                commissionConfig: { type: 'percentage', value: 10 }
            };

            vi.mocked(FirebaseService.acquireLock).mockResolvedValue(true);

            const result = await AppointmentEngine.bookAppointment(businessId, { ...data, employee });

            expect(result?.commissionAmount).toBe(10); // 10% of 100
        });
    });
});

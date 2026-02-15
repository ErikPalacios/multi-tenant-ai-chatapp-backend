import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FSMOrchestrator } from './Orchestrator.js';
import { FirebaseService } from '../../integrations/firebase/firebase.service.js';
import { TenantService } from '../../services/TenantService.js';
import { AppointmentEngine } from '../../domains/appointments/AppointmentEngine.js';
import { ConversationContext, Customer, ConversationStatus } from '../../interfaces/index.js';

// Mocks
vi.mock('../../integrations/firebase/firebase.service.js');
vi.mock('../../services/TenantService.js');
vi.mock('../../domains/appointments/AppointmentEngine.js');

describe('Appointment Flow Integration (n8n Style)', () => {
    const businessId = 'test-biz';
    const customer: Customer = {
        waId: '12345',
        businessId: 'test-biz',
        name: 'Erik Test',
        status: 'IDLE',
        humanSupportActive: false,
        lastInteraction: new Date(),
        metadata: {},
        label: '',
        notes: ''
    };

    // Configuración base de los servicios mockeados
    beforeEach(() => {
        vi.clearAllMocks();

        // Simulamos que existen servicios en Firebase
        vi.mocked(FirebaseService.getServices).mockResolvedValue([
            {
                id: 'srv-1',
                businessId: 'test-biz',
                name: 'Manicura',
                price: 200,
                durationMinutes: 30,
                productOrService: 'service'
            },
            {
                id: 'srv-2',
                businessId: 'test-biz',
                name: 'Pedicura',
                price: 300,
                durationMinutes: 30,
                productOrService: 'service'
            }
        ]);

        // Simulamos configuración del negocio
        vi.mocked(TenantService.getBusinessConfig).mockResolvedValue({
            workingHours: { start: '09:00', end: '18:00' }
        });

        // Simulamos días disponibles
        vi.mocked(AppointmentEngine.getAvailableDays).mockResolvedValue([
            '2024-05-25', '2024-05-26'
        ]);

        // Simulamos horarios disponibles
        vi.mocked(AppointmentEngine.getAvailableSlots).mockResolvedValue([
            '09:00', '10:00', '16:00'
        ]);

        // Simulamos creación de cita exitosa
        vi.mocked(AppointmentEngine.bookAppointment).mockResolvedValue({
            id: 'apt-123',
            folio: 'HN-001'
        } as any);
    });

    it('debe completar el flujo completo de agendado exitosamente', async () => {
        // --- TURNO 1: El usuario inicia el flujo (Input: "Hola", Clasificado como "Citas") ---
        let ctx: ConversationContext = {
            businessId,
            platform: 'whatsapp',
            customer,
            intent: 'Citas',
            message: { message: 'Hola' } as any,
            session: { waId: '12345', state: 'IDLE', memory: {} } as any
        };

        let response = await FSMOrchestrator.process(ctx);
        console.log('Response to ask for appointment', response);

        expect(response.newState).toBe('SELECT_SERVICE');
        expect(response.responseMessages[0]).toMatchObject({ content: expect.stringContaining('servicio') });

        // --- TURNO 2: El usuario elige "Manicura" ---
        ctx = {
            ...ctx,
            message: { message: 'Manicura' } as any,
            session: { ...ctx.session, state: response.newState, memory: { ...ctx.session.memory, ...response.memoryUpdate } } as any
        };

        response = await FSMOrchestrator.process(ctx);

        expect(response.newState).toBe('SELECT_DAY');
        expect(ctx.session.memory.serviceId).toBe('srv-1'); // Verificamos que "recordó" el servicio

        // --- TURNO 3: El usuario elige el día "2024-05-25" ---
        ctx = {
            ...ctx,
            message: { message: '2024-05-25' } as any,
            session: { ...ctx.session, state: response.newState, memory: { ...ctx.session.memory, ...response.memoryUpdate } } as any
        };

        response = await FSMOrchestrator.process(ctx);

        expect(response.newState).toBe('SELECT_TURN');
        expect(ctx.session.memory.date).toBe('2024-05-25');

        // --- TURNO 4: El usuario elige turno "morning" ---
        ctx = {
            ...ctx,
            message: { message: 'morning' } as any,
            session: { ...ctx.session, state: response.newState, memory: { ...ctx.session.memory, ...response.memoryUpdate } } as any
        };

        response = await FSMOrchestrator.process(ctx);

        expect(response.newState).toBe('SELECT_TIME');
        expect(ctx.session.memory.turn).toBe('morning');

        // --- TURNO 5: El usuario elige horario "09:00" ---
        ctx = {
            ...ctx,
            message: { message: '09:00' } as any,
            session: { ...ctx.session, state: response.newState, memory: { ...ctx.session.memory, ...response.memoryUpdate } } as any
        };

        response = await FSMOrchestrator.process(ctx);

        expect(response.newState).toBe('COLLECT_NAME');
        expect(ctx.session.memory.time).toBe('09:00');

        // --- TURNO 6: El usuario da su nombre ---
        ctx = {
            ...ctx,
            message: { message: 'Erik Palacios' } as any,
            session: { ...ctx.session, state: response.newState, memory: { ...ctx.session.memory, ...response.memoryUpdate } } as any
        };

        response = await FSMOrchestrator.process(ctx);

        expect(response.newState).toBe('CONFIRMATION');
        expect(ctx.session.memory.customerName).toBe('Erik Palacios');

        // --- TURNO 7: El usuario confirma la cita ---
        ctx = {
            ...ctx,
            message: { message: 'Sí, agendar' } as any,
            session: { ...ctx.session, state: response.newState, memory: { ...ctx.session.memory, ...response.memoryUpdate } } as any
        };

        response = await FSMOrchestrator.process(ctx);

        expect(response.newState).toBe('COMPLETED');
        expect(response.memoryUpdate?.lastFolio).toBe('HN-001');
    });
});

import { BusinessConfig, Service, Appointment, Employee } from '../../interfaces/index.js';
import { FirebaseService } from '../../integrations/firebase/firebase.service.js';
import { v4 as uuidv4 } from 'uuid';
import { CUTOFF_TIME, CUTOFF_TIME_NOCTURN } from '../../constants/messages.js';

export class AppointmentEngine {
    /**
     * Calculates available days for a service, ensuring there's at least one free slot.
     */
    static async getAvailableDays(businessId: string, config: BusinessConfig, service: Service): Promise<string[]> {
        // Set the max days date
        const availableDays: string[] = [];
        const today = new Date();
        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + config.maxDaysFuture);

        // Set the start date to the end date
        const startDateStr = new Date(today.getTime() + 86400000).toISOString().split('T')[0];
        const endDateStr = maxDate.toISOString().split('T')[0];

        // Fetch all appointments for this service in the range
        const appointments = await FirebaseService.getAppointmentsInRange(businessId, service.id, startDateStr, endDateStr);

        for (let i = 1; i <= config.maxDaysFuture; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const dayOfWeek = date.getDay();
            const dateStr = date.toISOString().split('T')[0];

            if (config.workDays.includes(dayOfWeek) && !config.holidays.includes(dateStr)) {
                // Check if there is at least one free slot on this day
                const appointmentsThisDay = appointments.filter(a => a.date === dateStr);
                const hasFreeSlot = await this.hasAvailableSlot(config, service, dateStr, appointmentsThisDay);

                if (hasFreeSlot) {
                    availableDays.push(dateStr);
                }
            }
        }

        return availableDays;
    }

    private static async hasAvailableSlot(config: BusinessConfig, service: Service, dateStr: string, appointments: Appointment[]): Promise<boolean> {
        let current = new Date(`${dateStr}T${config.startTime}:00`);
        const end = new Date(`${dateStr}T${config.endTime}:00`);
        const bookedTimes = new Set(appointments.map(a => a.time));

        while (current < end) {
            const timeStr = current.toTimeString().split(' ')[0].substring(0, 5);
            if (!bookedTimes.has(timeStr)) {
                return true; // Found at least one free slot
            }
            current.setMinutes(current.getMinutes() + service.durationMinutes);
        }

        return false;
    }

    /**
     * Calculates available turns (morning/afternoon) for a specific date and service.
     */
    static async getAvailableTurns(businessId: string, config: BusinessConfig, service: Service, date: string): Promise<string[]> {

        // Get the turns for the selected day
        const [day, month, year] = date.split('-').map(Number);
        const parsedDate = new Date(year, month - 1, day);
        const dayOfWeek = parsedDate.getDay();
        const maxTurnsPerDay = config.maxTurnsPerDay[dayOfWeek];

        switch (maxTurnsPerDay) {
            case 0:
                return [];
            case 1:
                return ['morning'];
            case 2:
                const turns2: string[] = [];
                const slots = await this.getAvailableSlots(businessId, config, service, date);

                const hasMorning = slots.some(s => s < CUTOFF_TIME);
                const hasAfternoon = slots.some(s => s >= CUTOFF_TIME);

                if (hasMorning) turns2.push('Matutino');
                if (hasAfternoon) turns2.push('Vespertino');

                return turns2;
            case 3:
                const turns3: string[] = [];
                const slots3 = await this.getAvailableSlots(businessId, config, service, date);

                const hasMorning3 = slots3.some(s => s < CUTOFF_TIME);
                const hasAfternoon3 = slots3.some(s => s >= CUTOFF_TIME && s < CUTOFF_TIME_NOCTURN);
                const hasNocturn3 = slots3.some(s => s >= CUTOFF_TIME_NOCTURN);

                if (hasMorning3) turns3.push('Matutino');
                if (hasAfternoon3) turns3.push('Vespertino');
                if (hasNocturn3) turns3.push('Nocturno');

                return turns3;
            default:
                return [];
        }

        const turns: string[] = [];
        const slots = await this.getAvailableSlots(businessId, config, service, date);

        const hasMorning = slots.some(s => s < CUTOFF_TIME);
        const hasAfternoon = slots.some(s => s >= CUTOFF_TIME);

        if (hasMorning) turns.push('morning');
        if (hasAfternoon) turns.push('afternoon');

        return turns;
    }

    static async getAvailableSlots(businessId: string, config: BusinessConfig, service: Service, date: string): Promise<string[]> {
        const slots: string[] = [];
        let current = new Date(`${date}T${config.startTime}:00`);
        let end = new Date(`${date}T${config.endTime}:00`);

        while (current < end) {
            const timeStr = current.toTimeString().split(' ')[0].substring(0, 5);

            // Check availability in DB
            const isAvailable = await FirebaseService.checkAvailability(businessId, service.id, date, timeStr);

            if (isAvailable) {
                slots.push(timeStr);
            }

            current.setMinutes(current.getMinutes() + service.durationMinutes);
        }

        return slots;
    }

    /**
     * Calculates available time slots for a specific date and service.
     */
    static async getAvailableSlotsByTurn(businessId: string,
        config: BusinessConfig,
        service: Service,
        date: string,
        turn: string,
        maxTurnsPerDay: number): Promise<string[]> {

        const slots: string[] = [];
        let current = new Date(`${date}T${config.startTime}:00`);
        let end = new Date(`${date}T${config.endTime}:00`);

        const CUTOFF_TIME = '12:00';
        const CUTOFF_TIME_NOCTURN = '18:00';

        if (turn === 'Matutino') {
            end = new Date(`${date}T${CUTOFF_TIME}:00`);
        } else if (turn === 'Vespertino' && maxTurnsPerDay === 3) {
            current = new Date(`${date}T${CUTOFF_TIME}:00`);
            end = new Date(`${date}T${CUTOFF_TIME_NOCTURN}:00`);
        } else if (turn === 'Vespertino' && maxTurnsPerDay === 2) {
            current = new Date(`${date}T${CUTOFF_TIME}:00`);
            end = new Date(`${date}T${config.endTime}:00`);
        } else if (turn === 'Nocturno') {
            current = new Date(`${date}T${CUTOFF_TIME_NOCTURN}:00`);
            end = new Date(`${date}T${config.endTime}:00`);
        } else {
            current = new Date(`${date}T${config.startTime}:00`);
            end = new Date(`${date}T${config.endTime}:00`);
        }


        while (current < end) {
            const timeStr = current.toTimeString().split(' ')[0].substring(0, 5);

            // Check availability in DB
            const isAvailable = await FirebaseService.checkAvailability(businessId, service.id, date, timeStr);

            if (isAvailable) {
                slots.push(timeStr);
            }

            current.setMinutes(current.getMinutes() + service.durationMinutes);
        }

        return slots;
    }

    /**
     * Attempts to lock a slot and create an appointment.
     */
    static async bookAppointment(businessId: string, data: Appointment): Promise<Appointment | null> {
        const lockId = `${businessId}:${data.serviceId}:${data.date}:${data.time}`;

        const locked = await FirebaseService.acquireLock(lockId);
        if (!locked) return null;

        try {
            const appointment = {
                id: uuidv4(),
                businessId,
                customerId: data.customerId,
                serviceId: data.serviceId,
                serviceName: data.serviceName,
                date: data.date,
                time: data.time,
                status: 'confirmed',
                folio: `APP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                createdAt: new Date(),
                employeeId: "1234",
                commissionAmount: 0
            };

            await FirebaseService.saveAppointment(businessId, appointment);
            return appointment;
        } finally {
            await FirebaseService.releaseLock(lockId);
        }
    }


    private static calculateCommission(service: Service, employee?: Employee): number | undefined {
        if (!employee || !employee.commissionConfig || !service.price) return undefined;

        const { type, value } = employee.commissionConfig;
        if (type === 'percentage') {
            return (service.price * value) / 100;
        } else {
            return value;
        }
    }

    static async generateFolio(): Promise<string> {
        // Generar un folio corto y legible tipo "CITA-AB123"
        const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
        const folio = `${randomPart}`;

        return folio;
    }

}



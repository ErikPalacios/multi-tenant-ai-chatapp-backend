import type { DocumentReference, Timestamp } from 'firebase-admin/firestore';

export type ConversationStatus =
    | 'IDLE'
    | 'SELECT_SERVICE'
    | 'SELECT_DAY'
    | 'SELECT_TURN'
    | 'SELECT_TIME'
    | 'COLLECT_NAME'
    | 'CONFIRMATION'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'soporte'
    | 'fallback'
    | 'AGENT_CLASSIFIER';

export type Intent =
    | 'Saludo'
    | 'Citas'
    | 'FAQ'
    | 'Promociones'
    | 'Soporte'
    | 'Confirmacion'
    | 'Reagendar'
    | 'Servicios'
    | 'cancelarCita'
    | 'Agradecimientos'
    | 'Fallback';

export type EmployeeRole = 'owner' | 'manager' | 'staff';

export interface Employee {
    id: string;
    businessId: string;
    name: string;
    role: EmployeeRole;
    isActive: boolean;
    commissionConfig?: {
        type: 'percentage' | 'fixed';
        value: number;
    };
}

export interface EmployeeActivity {
    id: string;
    businessId: string;
    employeeId: string;
    action: string;
    entityId?: string;
    timestamp: Date;
    details?: string;
}


export interface Business {
    id: string;
    name: string;
    whatsappConfig: {
        phone: string;
        platform: 'wati' | 'meta';
        watiToken?: string;
        watiApiUrl?: string;
        metaToken?: string;
        metaPhoneNumberId?: string;
    };
    onboardingCompleted: boolean;
    industry?: string;
    monthlyVolume?: string;
    whatsappUsage?: string;
    isActive: boolean;
    createdAt: Date;
}

export interface MessageTemplate {
    id: string; // "template_1"
    businessId?: string; // If undefined, it's a global "pre-made" template.
    name: string; // e.g. "Clínica de Salud"
    description: string;
    sections: TemplateSection[];
    isActive?: boolean; // Indicates if this is the currently active template for the business
}

export interface TemplateSection {
    id: string; // e.g. "saludo"
    title: string; // "Saludo Initial"
    order: number;
    messages: TemplateMessage[];
}

export interface TemplateMessage {
    id: string; // e.g. "saludo_bienvenida"
    description: string; // "El bot responde al primer saludo"
    exampleUserMessage: string; // "Hola, buenas tardes!"
    defaultBotMessage: string; // "¡Hola! Bienvenido a {{businessName}}, ¿en qué te puedo ayudar?"
}


export interface User {
    id: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
}

export interface Membership {
    userId: string;
    businessId: string;
    role: 'OWNER' | 'EMPLOYEE';
}

export interface JWTPayload {
    userId: string;
    businessId: string;
    role: string;
}

export interface TenantInfo {
    businessId: string;
    platform: 'wati' | 'meta';
}

export interface BusinessConfig {
    workDays: number[]; // 0-6
    startTime: string; // "09:00"
    endTime: string; // "18:00"
    maxDaysFuture: number;
    maxTurnsPerDay: Record<string, number>;
    slotsPerService: Record<string, number>; // capacity per service type
    holidays: string[]; // ["YYYY-MM-DD"]
}

export interface Service {
    id: string;
    businessId: string;
    name: string;
    durationMinutes: number;
    price?: number;
    description?: string;
    image?: string;
    ubicacion?: string;
    category?: string;
    productOrService: 'product' | 'service';
}

export interface Customer {
    waId: string;
    businessId: string;
    name: string;
    status: ConversationStatus;
    humanSupportActive: boolean;
    lastInteraction: Date;
    metadata?: Record<string, any>;
    label?: string;
    notes?: string;
}

export interface ConversationSession {
    waId: string;
    businessId: string;
    state: ConversationStatus;
    memory: Record<string, any>;
    expiresAt: Date;
}

export interface Memory {
    serviceId: string;
    serviceName: string;
    date: string;
    time: string;
    turn: string;
}

export interface Appointment {
    id: string;
    businessId: string;
    customerId: string;
    serviceId: string;
    serviceName: string;
    date: string; // "YYYY-MM-DD"
    time: string; // "HH:mm"
    name: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    folio: string;
    createdAt: Date;
    employeeId?: string;
    commissionAmount?: number;
}


export interface SlotLock {
    id: string; // businessId:serviceId:date:time
    businessId: string;
    expiresAt: Date;
}

export interface ConversationContext {
    businessId: string;
    platform: string;
    customer: Customer;
    session: ConversationSession;
    message: ChatMessage;
    code?: string;
    intent?: Intent;
}

export type StructuredMessage =
    | { type: 'text'; content: string }
    | { type: 'buttons'; content: string; buttons: string[] }
    | { type: 'list'; content: string; title: string; buttonText: string; rows: { title: string; description?: string }[] }
    | {
        type: 'buttons';
        content: string;
        buttons: string[]
    }

    | {
        type: 'list';
        content: string;
        title: string;
        buttonText: string;
        rows: { title: string; description?: string }[]
    };

export interface DomainResponse {
    newState: ConversationStatus;
    responseMessages: (string | StructuredMessage)[];
    memoryUpdate?: Record<string, any>;
    actions?: string[];
}

export interface WatiMessage {
    waId: string;
    text: string;
    type: 'text' | 'button' | 'list' | 'image' | 'document';
    timestamp: string;
    senderName?: string;
    listReply?: {
        title: string;
        description: string;
    };
    buttonReply?: {
        text: string;
    };
}

export interface ChatMessage {
    message: string;
    nameOfSender: string;
    timeStamp: string;
    uidOfSender: DocumentReference;
}

export interface Chat {
    classification: string;
    lastMessage: string;
    lastMessageSeenBy: DocumentReference;
    nombre: string;
    numero: string;
    timestamp: Timestamp;
    userIds: DocumentReference[];
    userNames: string[];
}

export interface Soporte {
    activo: boolean;
    clasificacion: string;
    created_at: Timestamp;
    display_name: string;
    name: string;
    number: string;
}

export interface Cita {
    confirmacion1Enviada: boolean;
    confirmada: boolean;
    fecha: Timestamp;
    fechaFormat: string;
    folio: string;
    hora: string;
    nombre: string;
    numero: string;
    servicio: string;
    timestamp: Timestamp
}



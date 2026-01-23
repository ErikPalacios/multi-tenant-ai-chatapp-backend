export type ConversationStatus = 
    | 'nuevo' 
    | 'activo' 
    | 'citas' 
    | 'reagendando' 
    | 'recibiendoNombre' 
    | 'agendacionInterrumpida' 
    | 'cancelar' 
    | 'soporte' 
    | 'cancelarCita' 
    | 'fallback';

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

export interface Customer {
    waId: string;
    name: string;
    status: ConversationStatus;
    humanSupportActive: boolean;
    lastInteraction: Date;
    metadata?: Record<string, any>;
}

export interface ConversationContext {
    customer: Customer;
    message: WatiMessage;
    intent?: Intent;
    history?: any[];
}

export interface DomainResponse {
    newState: ConversationStatus;
    responseMessages: string[];
    actions?: string[];
}

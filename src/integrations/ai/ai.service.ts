import { Intent } from '../../interfaces/index.js';

export class AIService {
    /**
     * Classifies a message into an intent.
     * In production, this would call GPT-4, Llama 3, or a Vector DB.
     */
    static async classifyIntent(text: string): Promise<Intent> {
        const input = text.toLowerCase();

        if (input.includes('hola') || input.includes('buenos')) return 'Saludo';
        if (input.includes('cita') || input.includes('turno') || input.includes('agendar')) return 'Citas';
        if (input.includes('promo') || input.includes('descuento')) return 'Promociones';
        if (input.includes('soporte') || input.includes('ayuda') || input.includes('humano')) return 'Soporte';
        if (input.includes('si') || input.includes('confirmar')) return 'Confirmacion';
        if (input.includes('no') || input.includes('reagendar') || input.includes('cambiar')) return 'Reagendar';

        return 'FAQ'; // Default fallback to RAG/FAQ
    }

    static async getRAGResponse(query: string): Promise<string> {
        return "Lo siento, aún estoy aprendiendo sobre este tema. ¿Te gustaría hablar con un agente humano?";
    }
}

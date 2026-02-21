import { db } from '../../integrations/firebase/firebase.service.js';
import type { MessageTemplate } from '../../interfaces/index.js';

export class FlowTemplateService {
    private static COL_TEMPLATES = 'message_templates';

    /**
     * Retrieves all available global message templates (pre-made, no businessId).
     */
    static async getGlobalTemplates(): Promise<MessageTemplate[]> {
        const snapshot = await db.collection(this.COL_TEMPLATES)
            .where('businessId', '==', 'global')
            .get();

        return snapshot.docs.map((doc: any) => doc.data() as MessageTemplate);
    }

    /**
     * Retrieves all templates belonging to a specific business.
     */
    static async getBusinessTemplates(businessId: string): Promise<MessageTemplate[]> {
        const snapshot = await db.collection(this.COL_TEMPLATES)
            .where('businessId', '==', businessId)
            .get();

        return snapshot.docs.map((doc: any) => doc.data() as MessageTemplate);
    }

    /**
     * Retrieves a specific template by its ID.
     */
    static async getTemplateById(templateId: string): Promise<MessageTemplate | null> {
        const doc = await db.collection(this.COL_TEMPLATES).doc(templateId).get();
        if (!doc.exists) return null;
        return doc.data() as MessageTemplate;
    }

    /**
     * Creates or updates a template for a specific business.
     */
    static async saveBusinessTemplate(businessId: string, template: MessageTemplate): Promise<MessageTemplate> {
        template.businessId = businessId;

        if (!template.id.includes(businessId)) {
            template.id = `${businessId}_${template.id.replace('global_', '')}`;
        }

        const templateRef = db.collection(this.COL_TEMPLATES).doc(template.id);

        if (template.isActive) {
            const currentActive = await this.getBusinessTemplates(businessId);
            const batch = db.batch();
            currentActive.forEach(t => {
                if (t.id !== template.id && t.isActive) {
                    batch.update(db.collection(this.COL_TEMPLATES).doc(t.id), { isActive: false });
                }
            });
            await batch.commit();
        }

        await templateRef.set(template, { merge: true });
        return template;
    }

    /**
     * Helper to seed the database with initial templates if empty.
     */
    static async seedInitialTemplates(): Promise<void> {
        const templates: MessageTemplate[] = [
            {
                id: 'global_template_beauty',
                businessId: 'global',
                name: 'Salón de Belleza / Peluquería',
                description: 'Flujo conversacional optimizado para estéticas y salones.',
                sections: [
                    {
                        id: 'sec_saludo',
                        title: '👋 Saludo y Bienvenida',
                        order: 1,
                        messages: [
                            {
                                id: 'saludo_nuevo',
                                description: 'Mensaje inicial cuando un cliente nuevo escribe por primera vez.',
                                exampleUserMessage: 'Hola, me gustaría agendar una cita',
                                defaultBotMessage: '¡Hola! Qué gusto saludarte. Bienvenido a {{businessName}} ✨\n\n¿En qué te podemos consentir hoy?'
                            },
                            {
                                id: 'saludo_recurrente',
                                description: 'Mensaje inicial cuando un cliente que ya tiene historial escribe.',
                                exampleUserMessage: 'Hola chicas',
                                defaultBotMessage: '¡Hola de nuevo {{customerName}}! Qué bueno verte por aquí. 💖\n\n¿Deseas agendar un servicio o tienes otra consulta?'
                            }
                        ]
                    },
                    {
                        id: 'sec_citas',
                        title: '📅 Agendar Citas',
                        order: 2,
                        messages: [
                            {
                                id: 'cita_recoleccion_servicio',
                                description: 'Mensaje para preguntar qué servicio desean.',
                                exampleUserMessage: 'Quiero un corte',
                                defaultBotMessage: '¡Claro que sí! Estos son nuestros servicios principales:\n\nPor favor, escribe el número o el nombre del servicio que prefieres.'
                            },
                            {
                                id: 'cita_confirmacion',
                                description: 'Mensaje de éxito al reservar.',
                                exampleUserMessage: 'Confirmo',
                                defaultBotMessage: '¡Listo! Tu cita para **{{serviceName}}** ha sido agendada con éxito para el **{{date}}** a las **{{time}}**. ¡Te esperamos! 💅'
                            }
                        ]
                    }
                ]
            },
            {
                id: 'global_template_clinic',
                businessId: 'global',
                name: 'Clínica Médica / Dental',
                description: 'Flujo formal y estructurado para consultas de salud.',
                sections: [
                    {
                        id: 'sec_saludo',
                        title: '👋 Atención Inicial',
                        order: 1,
                        messages: [
                            {
                                id: 'saludo_nuevo',
                                description: 'Mensaje para pacientes nuevos.',
                                exampleUserMessage: 'Buenas tardes',
                                defaultBotMessage: 'Buenas tardes. Se ha comunicado a {{businessName}}. 🩺\n\nSoy su asistente virtual. ¿Le gustaría programar una consulta o requiere información sobre nuestros servicios?'
                            }
                        ]
                    },
                    {
                        id: 'sec_citas',
                        title: '📅 Programación de Consultas',
                        order: 2,
                        messages: [
                            {
                                id: 'cita_recoleccion_servicio',
                                description: 'Pregunta sobre la especialidad o servicio médico.',
                                exampleUserMessage: 'Necesito consulta',
                                defaultBotMessage: 'Entendido. Por favor, indíqueme la especialidad o el tipo de consulta que requiere:'
                            },
                            {
                                id: 'cita_confirmacion',
                                description: 'Mensaje de éxito al agendar.',
                                exampleUserMessage: 'Es correcto',
                                defaultBotMessage: 'Su cita ha sido confirmada para el día **{{date}}** a las **{{time}}** para **{{serviceName}}**.\n\nLe recordamos llegar 10 minutos antes de su consulta.'
                            }
                        ]
                    }
                ]
            }
        ];

        const batch = db.batch();
        for (const template of templates) {
            const ref = db.collection(this.COL_TEMPLATES).doc(template.id);
            batch.set(ref, template, { merge: true });
        }
        await batch.commit();
        console.log('✅ Initial templates seeded to Firestore');
    }
}

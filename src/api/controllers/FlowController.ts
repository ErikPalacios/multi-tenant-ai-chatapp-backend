import { Request, Response } from 'express';
import { FlowTemplateService } from '../../domains/flow/FlowTemplateService.js';

export class FlowController {

    /**
     * GET /api/templates/global
     * Fetch all available base pre-made templates for the frontend configuration
     */
    static async getGlobalTemplates(req: Request, res: Response) {
        try {
            const templates = await FlowTemplateService.getGlobalTemplates();
            return res.status(200).json(templates);
        } catch (error) {
            console.error('Error in getGlobalTemplates:', error);
            return res.status(500).json({ error: 'Failed to fetch global templates' });
        }
    }

    /**
     * GET /api/templates/business
     * Get the templates owned by the logged-in user's business.
     */
    static async getBusinessTemplates(req: Request, res: Response) {
        try {
            // @ts-ignore - Assuming authMiddleware attaches user payload
            const { businessId } = req.user;

            if (!businessId) {
                return res.status(400).json({ error: 'Business ID is missing from token payload' });
            }

            const templates = await FlowTemplateService.getBusinessTemplates(businessId);
            return res.status(200).json(templates);

        } catch (error) {
            console.error('Error in getBusinessTemplates:', error);
            return res.status(500).json({ error: 'Failed to fetch business templates' });
        }
    }

    /**
     * POST /api/templates/business
     * Creates or Updates a template for the business (clones a global one or saves edits)
     */
    static async saveBusinessTemplate(req: Request, res: Response) {
        try {
            // @ts-ignore
            const { businessId } = req.user;
            const { template } = req.body;

            if (!businessId) {
                return res.status(400).json({ error: 'Business ID is missing' });
            }

            if (!template || !template.id) {
                return res.status(400).json({ error: 'Invalid payload. template object is required.' });
            }

            const savedTemplate = await FlowTemplateService.saveBusinessTemplate(businessId, template);

            return res.status(200).json(savedTemplate);

        } catch (error) {
            console.error('Error in saveBusinessTemplate:', error);
            return res.status(500).json({ error: 'Failed to save template' });
        }
    }
}

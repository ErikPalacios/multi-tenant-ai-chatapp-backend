import { Response } from 'express';
import { CustomRequest } from '../middlewares/auth.middleware.js';
import { BusinessService } from '../../domains/business/BusinessService.js';

export class BusinessController {
    static async completeOnboarding(req: CustomRequest, res: Response) {
        const businessId = req.user?.businessId;
        const { industry, monthlyVolume, whatsappUsage } = req.body;

        if (!businessId) {
            return res.status(401).json({ error: 'Unauthorized. No business ID found.' });
        }

        if (!industry || !monthlyVolume || !whatsappUsage) {
            return res.status(400).json({ error: 'Missing required onboarding fields.' });
        }

        try {
            console.log(`[Onboarding] Completing onboarding for business: ${businessId}`);
            await BusinessService.updateOnboarding(businessId, {
                industry,
                monthlyVolume,
                whatsappUsage,
                onboardingCompleted: true
            });

            return res.status(200).json({ message: 'Onboarding completed successfully.' });
        } catch (error) {
            console.error('completeOnboarding error:', error);
            return res.status(500).json({ error: 'Internal server error while saving onboarding data.' });
        }
    }
}

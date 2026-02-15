import { FirebaseService } from '../../integrations/firebase/firebase.service.js';
import { Business } from '../../interfaces/index.js';
import { v4 as uuidv4 } from 'uuid';

export class BusinessService {
    static async createBusiness(name: string, whatsappConfig: Business['whatsappConfig']): Promise<Business> {
        const business: Business = {
            id: uuidv4(),
            name,
            whatsappConfig,
            isActive: true,
            createdAt: new Date()
        };
        await FirebaseService.saveBusiness(business);
        return business;
    }

    static async getBusiness(businessId: string): Promise<Business | null> {
        return FirebaseService.getBusiness(businessId);
    }
}

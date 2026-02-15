import { Request } from 'express';
import { Business, TenantInfo } from '../interfaces/index.js';
import admin from 'firebase-admin';

export class TenantService {
    /**
     * Resolves the businessId from the incoming request.
     * Maps phone_number_id (or destination number) to a businessId.
     */
    static async resolveBusiness(req: Request): Promise<TenantInfo> {
        const body = req.body;

        // In WATI, we might have destinationNumber or we can map waId in some cases
        // But the prompt says "No depender del contenido del mensaje del usuario"
        // and "Use metadata del webhook (ej. phone_number_id)"

        const phoneNumberId = body.destinationNumber || body.whatsappId; // Common fields in WATI/Official API

        if (!phoneNumberId) {
            console.error('No business identifier found in webhook body');
            throw new Error('Business resolution failed');
        }

        // We could have a mapping in Firestore or a constant for now
        // For production, this should be a look-up in /businesses collection
        // where business.phone == phoneNumberId

        const businessSnapshot = await admin.firestore()
            .collection('businesses')
            .where('phone', '==', phoneNumberId)
            .limit(1)
            .get();

        if (businessSnapshot.empty) {
            // Fallback for development if not configured
            console.warn(`Business not found for phone: ${phoneNumberId}. Using default.`);
            return { businessId: 'default-business', platform: 'wati' };
        }

        const data = businessSnapshot.docs[0].data();
        return {
            businessId: businessSnapshot.docs[0].id,
            platform: data?.platform || 'wati'
        };
    }

    static async getBusinessConfig(businessId: string): Promise<any> {
        const doc = await admin.firestore()
            .doc(`businesses/${businessId}/configs/default`)
            .get();
        return doc.data();
    }
}

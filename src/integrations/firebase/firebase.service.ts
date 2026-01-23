import * as admin from 'firebase-admin';
import { Customer } from '../../interfaces/index.js';

// Initialize Firebase (Assuming serviceAccountKey will be provided in production)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault()
    });
}

const db = admin.firestore();

export class FirebaseService {
    private static customersColl = db.collection('customers');

    static async getCustomer(waId: string): Promise<Customer | null> {
        const doc = await this.customersColl.doc(waId).get();
        if (!doc.exists) return null;
        const data = doc.data();
        return {
            ...data,
            lastInteraction: data?.lastInteraction?.toDate()
        } as Customer;
    }

    static async saveCustomer(customer: Customer): Promise<void> {
        await this.customersColl.doc(customer.waId).set({
            ...customer,
            lastInteraction: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    }

    static async logMessage(waId: string, message: any): Promise<void> {
        await this.customersColl.doc(waId).collection('messages').add({
            ...message,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
    }
}

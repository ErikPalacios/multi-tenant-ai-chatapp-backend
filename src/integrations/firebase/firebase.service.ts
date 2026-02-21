import admin from 'firebase-admin';
import { Customer, Business, BusinessConfig, Service, ConversationSession, Appointment, SlotLock, Employee, EmployeeActivity, User, Membership } from '../../interfaces/index.js';

// Initialize Firebase (Assuming serviceAccountKey will be provided in production)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault()
    });
}

export const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

export class FirebaseService {
    // Utility for multi-tenant collection paths
    private static businessDoc(businessId: string) {
        return db.collection('businesses').doc(businessId);
    }

    private static customersColl(businessId: string) {
        return this.businessDoc(businessId).collection('customers');
    }

    private static sessionsColl(businessId: string) {
        return this.businessDoc(businessId).collection('sessions');
    }

    private static appointmentsColl(businessId: string) {
        return this.businessDoc(businessId).collection('appointments');
    }

    private static servicesColl(businessId: string) {
        return this.businessDoc(businessId).collection('services');
    }

    private static employeesColl(businessId: string) {
        return this.businessDoc(businessId).collection('employees');
    }

    private static activitiesColl(businessId: string) {
        return this.businessDoc(businessId).collection('activities');
    }


    private static locksColl = db.collection('locks');

    // --- Customer Methods ---

    static async getCustomer(businessId: string, waId: string): Promise<Customer | null> {
        const doc = await this.customersColl(businessId).doc(waId).get();
        if (!doc.exists) return null;
        const data = doc.data();
        return {
            ...data,
            lastInteraction: data?.lastInteraction?.toDate()
        } as Customer;
    }

    static async logCustomer(businessId: string, customer: Customer): Promise<void> {
        await this.customersColl(businessId).doc(customer.waId).set({
            ...customer,
            businessId,
            lastInteraction: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    }

    // --- Session Methods ---

    static async getSession(businessId: string, waId: string): Promise<ConversationSession | null> {
        const doc = await this.sessionsColl(businessId).doc(waId).get();
        if (!doc.exists) return null;
        const data = doc.data();
        return {
            ...data,
            expiresAt: data?.expiresAt?.toDate()
        } as ConversationSession;
    }

    static async saveSession(businessId: string, session: ConversationSession): Promise<void> {
        await this.sessionsColl(businessId).doc(session.waId).set({
            ...session,
            businessId,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
    }

    // --- Service Methods ---

    static async getServices(businessId: string): Promise<Service[]> {
        const snapshot = await this.servicesColl(businessId).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
    }

    // --- Appointment Methods ---

    static async saveAppointment(businessId: string, appointment: Appointment): Promise<void> {
        await this.appointmentsColl(businessId).doc(appointment.id).set({
            ...appointment,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
    }

    static async checkAvailability(businessId: string, serviceId: string, date: string, time: string): Promise<boolean> {
        // Simple check: count appointments for this slot
        const snapshot = await this.appointmentsColl(businessId)
            .where('serviceId', '==', serviceId)
            .where('date', '==', date)
            .where('time', '==', time)
            .where('status', '!=', 'cancelled')
            .get();

        // This is a simple version. Real logic might involve dynamic capacity from BusinessConfig
        return snapshot.empty;
    }

    static async getAppointmentsInRange(businessId: string, serviceId: string, startDate: string, endDate: string): Promise<Appointment[]> {
        const snapshot = await this.appointmentsColl(businessId)
            .where('serviceId', '==', serviceId)
            .where('date', '>=', startDate)
            .where('date', '<=', endDate)
            .where('status', '!=', 'cancelled')
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
    }

    // --- Concurrency / Locking ---

    static async acquireLock(lockId: string, ttlSeconds: number = 30): Promise<boolean> {
        const lockRef = this.locksColl.doc(lockId);
        const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

        try {
            return await db.runTransaction(async (transaction) => {
                const doc = await transaction.get(lockRef);
                const now = new Date();

                if (doc.exists) {
                    const data = doc.data();
                    if (data?.expiresAt?.toDate() > now) {
                        return false; // Already locked and not expired
                    }
                }

                transaction.set(lockRef, { expiresAt });
                return true;
            });
        } catch (error) {
            console.error('Lock error:', error);
            return false;
        }
    }

    static async releaseLock(lockId: string): Promise<void> {
        await this.locksColl.doc(lockId).delete();
    }

    // --- Employee Methods ---

    static async getEmployee(businessId: string, employeeId: string): Promise<Employee | null> {
        const doc = await this.employeesColl(businessId).doc(employeeId).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() } as Employee;
    }

    static async saveEmployee(businessId: string, employee: Employee): Promise<void> {
        await this.employeesColl(businessId).doc(employee.id).set({
            ...employee,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    }

    static async listEmployees(businessId: string): Promise<Employee[]> {
        const snapshot = await this.employeesColl(businessId).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee));
    }

    // --- Activity Methods ---

    static async logActivity(businessId: string, activity: EmployeeActivity): Promise<void> {
        const id = activity.id || db.collection('dummy').doc().id;
        await this.activitiesColl(businessId).doc(id).set({
            ...activity,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
    }

    // --- Auth & User Methods ---

    private static usersColl = db.collection('users');
    private static membershipsColl = db.collection('memberships');

    static async saveUser(user: User): Promise<void> {
        await this.usersColl.doc(user.id).set({
            ...user,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
    }

    static async getUserByEmail(email: string): Promise<User | null> {
        const snapshot = await this.usersColl.where('email', '==', email).limit(1).get();
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate()
        } as User;
    }

    static async getUserById(userId: string): Promise<User | null> {
        const doc = await this.usersColl.doc(userId).get();
        if (!doc.exists) return null;
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data?.createdAt?.toDate()
        } as User;
    }

    static async saveBusiness(business: Business): Promise<void> {
        // Here we ensure compatibility with the existing resolveBusiness
        // by mapping whatsappConfig.phone to the phone field at the root
        await this.businessDoc(business.id).set({
            ...business,
            phone: business.whatsappConfig.phone,
            platform: business.whatsappConfig.platform,
            watiToken: business.whatsappConfig.watiToken,
            watiApiUrl: business.whatsappConfig.watiApiUrl,
            metaToken: business.whatsappConfig.metaToken,
            metaPhoneNumberId: business.whatsappConfig.metaPhoneNumberId,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
    }

    static async getBusiness(businessId: string): Promise<Business | null> {
        const doc = await this.businessDoc(businessId).get();
        if (!doc.exists) return null;
        const data = doc.data();
        // Construct the Business object back from flat fields if necessary
        // but for now let's assume it was saved with the new structure too
        return {
            id: doc.id,
            ...data,
            createdAt: data?.createdAt?.toDate()
        } as Business;
    }

    static async updateBusiness(businessId: string, data: Partial<Business>): Promise<void> {
        await this.businessDoc(businessId).update({
            ...data,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
    }

    static async saveMembership(membership: Membership): Promise<void> {
        const id = `${membership.userId}_${membership.businessId}`;
        await this.membershipsColl.doc(id).set(membership);
    }

    static async getMembership(userId: string, businessId: string): Promise<Membership | null> {
        const id = `${userId}_${businessId}`;
        const doc = await this.membershipsColl.doc(id).get();
        if (!doc.exists) return null;
        return doc.data() as Membership;
    }

    static async getMembershipsByUser(userId: string): Promise<Membership[]> {
        const snapshot = await this.membershipsColl.where('userId', '==', userId).get();
        return snapshot.docs.map(doc => doc.data() as Membership);
    }

    static async listMembershipsByBusiness(businessId: string): Promise<Membership[]> {
        const snapshot = await this.membershipsColl.where('businessId', '==', businessId).get();
        return snapshot.docs.map(doc => doc.data() as Membership);
    }
}



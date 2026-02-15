import { FirebaseService } from '../../integrations/firebase/firebase.service.js';
import { User, Membership } from '../../interfaces/index.js';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
    static async createUser(email: string, passwordHash: string): Promise<User> {
        const user: User = {
            id: uuidv4(),
            email,
            passwordHash,
            createdAt: new Date()
        };
        await FirebaseService.saveUser(user);
        return user;
    }

    static async getUserByEmail(email: string): Promise<User | null> {
        return FirebaseService.getUserByEmail(email);
    }

    static async getUserById(userId: string): Promise<User | null> {
        return FirebaseService.getUserById(userId);
    }

    static async createMembership(userId: string, businessId: string, role: 'OWNER' | 'EMPLOYEE'): Promise<Membership> {
        const membership: Membership = {
            userId,
            businessId,
            role
        };
        await FirebaseService.saveMembership(membership);
        return membership;
    }

    static async getMembershipsByUser(userId: string): Promise<Membership[]> {
        return FirebaseService.getMembershipsByUser(userId);
    }

    static async listMembershipsByBusiness(businessId: string): Promise<Membership[]> {
        return FirebaseService.listMembershipsByBusiness(businessId);
    }
}

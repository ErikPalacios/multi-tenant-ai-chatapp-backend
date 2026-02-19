import { Response } from 'express';
import { CustomRequest } from '../middlewares/auth.middleware.js';
import { AuthService } from '../../domains/auth/AuthService.js';
import { UserService } from '../../domains/users/UserService.js';
import { BusinessService } from '../../domains/business/BusinessService.js';
import { FirebaseService } from '../../integrations/firebase/firebase.service.js';

export class AuthController {
    static async registerOwner(req: CustomRequest, res: Response) {
        const { email, password, businessName, whatsappConfig } = req.body;

        if (!email || !password || !businessName || !whatsappConfig || !whatsappConfig.phone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            console.log(`[Reg Debug] Starting registration for: ${email}`);
            const existingUser = await UserService.getUserByEmail(email);
            if (existingUser) {
                // Check if they are an orphaned user from a previous failed registration
                const memberships = await UserService.getMembershipsByUser(existingUser.id);
                if (memberships.length === 0) {
                    console.log(`[Reg Debug] User exists but has no memberships. Proceeding to create business for: ${email}`);
                    const business = await BusinessService.createBusiness(businessName, whatsappConfig);
                    console.log(`[Reg Debug] Business created: ${business.id}`);

                    const membership = await UserService.createMembership(existingUser.id, business.id, 'OWNER');
                    console.log(`[Reg Debug] Membership created`);

                    const token = AuthService.generateToken({
                        userId: existingUser.id,
                        businessId: business.id,
                        role: membership.role
                    });
                    console.log(`[Reg Debug] Token generated for orphaned user`);

                    return res.status(201).json({ token });
                }

                console.log(`[Reg Error] User already exists and has a business: ${email}`);
                return res.status(400).json({ error: 'User already exists' });
            }

            const passwordHash = await AuthService.hashPassword(password);
            console.log(`[Reg Debug] Password hashed`);

            const user = await UserService.createUser(email, passwordHash);
            console.log(`[Reg Debug] User created: ${user.id}`);

            const business = await BusinessService.createBusiness(businessName, whatsappConfig);
            console.log(`[Reg Debug] Business created: ${business.id}`);

            const membership = await UserService.createMembership(user.id, business.id, 'OWNER');
            console.log(`[Reg Debug] Membership created`);

            const token = AuthService.generateToken({
                userId: user.id,
                businessId: business.id,
                role: membership.role
            });
            console.log(`[Reg Debug] Token generated`);

            return res.status(201).json({ token });
        } catch (error: any) {
            console.error('Registration error details:', error.message, error.stack);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async login(req: CustomRequest, res: Response) {
        const { email, password } = req.body;
        console.log(`[Login Attempt] Email: ${email}`);

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        try {
            const user = await UserService.getUserByEmail(email);
            if (!user) {
                console.log(`[Login Error] User not found for email: ${email}`);
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            console.log(`[Login Debug] User found: ${user.id}`);
            const isValid = await AuthService.comparePassword(password, user.passwordHash);

            if (!isValid) {
                console.log(`[Login Error] Password mismatch for user: ${email}`);
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // For now, take the first membership. Real app might need a business selection.
            const memberships = await UserService.getMembershipsByUser(user.id);
            console.log(`[Login Debug] Memberships found: ${memberships.length}`);

            if (memberships.length === 0) {
                return res.status(403).json({ error: 'User has no business membership' });
            }

            const membership = memberships[0];
            const token = AuthService.generateToken({
                userId: user.id,
                businessId: membership.businessId,
                role: membership.role
            });

            return res.status(200).json({ token });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getMe(req: CustomRequest, res: Response) {
        const userId = req.user?.userId;
        const businessId = req.user?.businessId;

        if (!userId || !businessId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const user = await UserService.getUserById(userId);
            const business = await BusinessService.getBusiness(businessId);

            if (!user || !business) {
                return res.status(404).json({ error: 'User or business not found' });
            }

            const { passwordHash, ...userWithoutPassword } = user;

            return res.status(200).json({
                user: userWithoutPassword,
                business
            });
        } catch (error) {
            console.error('getMe error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getEmployees(req: CustomRequest, res: Response) {
        const businessId = req.user?.businessId;

        if (!businessId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const memberships = await UserService.listMembershipsByBusiness(businessId);
            const employees = await Promise.all(
                memberships.map(async (m) => {
                    const user = await UserService.getUserById(m.userId);
                    if (!user) return null;
                    const { passwordHash, ...userWithoutPassword } = user;
                    return { ...userWithoutPassword, role: m.role };
                })
            );

            return res.status(200).json(employees.filter(e => e !== null));
        } catch (error) {
            console.error('getEmployees error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async createEmployee(req: CustomRequest, res: Response) {
        const { email, password } = req.body;
        const businessId = req.user?.businessId;

        if (!email || !password || !businessId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            const existingUser = await UserService.getUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const passwordHash = await AuthService.hashPassword(password);
            const user = await UserService.createUser(email, passwordHash);
            await UserService.createMembership(user.id, businessId, 'EMPLOYEE');

            const { passwordHash: _, ...userWithoutPassword } = user;
            return res.status(201).json(userWithoutPassword);
        } catch (error) {
            console.error('createEmployee error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

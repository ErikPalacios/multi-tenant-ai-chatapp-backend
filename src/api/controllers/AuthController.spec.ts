import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';
import { FirebaseService } from '../../integrations/firebase/firebase.service.js';
import { AuthService } from '../../domains/auth/AuthService.js';

vi.mock('../../integrations/firebase/firebase.service.js');
vi.mock('../../domains/auth/AuthService.js');

describe('AuthController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('POST /auth/register-owner', () => {
        it('should register a new owner and return a token', async () => {
            vi.mocked(FirebaseService.getUserByEmail).mockResolvedValue(null);
            vi.mocked(AuthService.hashPassword).mockResolvedValue('hashed_password');
            vi.mocked(AuthService.generateToken).mockReturnValue('mocked_token');

            const response = await request(app)
                .post('/auth/register-owner')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    businessName: 'Test Business',
                    whatsappConfig: { phone: '1234567890', platform: 'wati' }
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token', 'mocked_token');
        });

        it('should return 400 if fields are missing', async () => {
            const response = await request(app)
                .post('/auth/register-owner')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /auth/login', () => {
        it('should login and return a token', async () => {
            vi.mocked(FirebaseService.getUserByEmail).mockResolvedValue({
                id: 'user123',
                email: 'test@example.com',
                passwordHash: 'hashed_password',
                createdAt: new Date()
            });
            vi.mocked(AuthService.comparePassword).mockResolvedValue(true);
            vi.mocked(FirebaseService.getMembershipsByUser).mockResolvedValue([{
                userId: 'user123',
                businessId: 'biz123',
                role: 'OWNER'
            }]);
            vi.mocked(AuthService.generateToken).mockReturnValue('mocked_token');

            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token', 'mocked_token');
        });
    });

    describe('GET /me', () => {
        it('should return 401 if no token provided', async () => {
            const response = await request(app).get('/me');
            expect(response.status).toBe(401);
        });

        it('should return user info if token is valid', async () => {
            vi.mocked(AuthService.verifyToken).mockReturnValue({
                userId: 'user123',
                businessId: 'biz123',
                role: 'OWNER'
            });
            vi.mocked(FirebaseService.getUserById).mockResolvedValue({
                id: 'user123',
                email: 'test@example.com',
                passwordHash: 'hashed_password',
                createdAt: new Date()
            });
            vi.mocked(FirebaseService.getBusiness).mockResolvedValue({
                id: 'biz123',
                name: 'Test Business',
                whatsappConfig: { phone: '12345', platform: 'wati' },
                isActive: true,
                createdAt: new Date()
            });

            const response = await request(app)
                .get('/me')
                .set('Authorization', 'Bearer valid_token');

            expect(response.status).toBe(200);
            expect(response.body.user.email).toBe('test@example.com');
            expect(response.body.business.name).toBe('Test Business');
        });
    });
});

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWTPayload } from '../../interfaces/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'heronova-secret-key-change-me';
const JWT_EXPIRATION = '1d';
const SALT_ROUNDS = 10;

export class AuthService {
    static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, SALT_ROUNDS);
    }

    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    static generateToken(payload: JWTPayload): string {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    }

    static verifyToken(token: string): JWTPayload {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    }
}

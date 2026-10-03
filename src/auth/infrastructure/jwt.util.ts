import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

export interface JwtPayload {
    sub: number; // userId
    email: string;
    iat: number;
    exp: number;
}

@Injectable()
export class JwtUtil {
    private readonly EXPIRATION_TIME = 24 * 60 * 60; // 24 hours in seconds

    constructor(private readonly jwtService: JwtService) {}

    /**
     * Generate a JWT token
     */
    generateToken(userId: number, email: string): string {
        const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
            sub: userId,
            email,
        };

        return this.jwtService.sign(payload, {
            expiresIn: this.EXPIRATION_TIME,
        });
    }

    /**
     * Verify and decode a JWT token
     */
    verifyToken(token: string): JwtPayload | null {
        try {
            return this.jwtService.verify<JwtPayload>(token);
        } catch {
            return null;
        }
    }

    /**
     * Decode token without verification (for getting payload)
     */
    decodeToken(token: string): JwtPayload | null {
        try {
            return this.jwtService.decode<JwtPayload>(token);
        } catch {
            return null;
        }
    }

    /**
     * Get expiration time
     */
    getExpirationDate(): Date {
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + this.EXPIRATION_TIME);
        return expiresAt;
    }
}

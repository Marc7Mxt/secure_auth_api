import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { LoginCommand } from './login.command.js';
import { USER_REPOSITORY } from '../../../users/domain/user.repository.js';
import type { UserRepository } from '../../../users/domain/user.repository.js';
import { SESSION_REPOSITORY } from '../../domain/session.repository.js';
import type { SessionRepository } from '../../domain/session.repository.js';
import { Session } from '../../domain/session.entity.js';
import { PasswordUtil } from '../../../shared/utils/password.util.js';
import { JwtUtil } from '../../infrastructure/jwt.util.js';

export interface LoginResult {
    token: string;
    expiresAt: Date;
    user: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
    };
}

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand, LoginResult> {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        @Inject(SESSION_REPOSITORY)
        private readonly sessionRepository: SessionRepository,
        private readonly jwtUtil: JwtUtil,
    ) {}

    async execute(command: LoginCommand): Promise<LoginResult> {
        // Find user by email
        const user = await this.userRepository.findByEmail(command.email);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Check if user is active
        if (!user.isActive) {
            throw new UnauthorizedException('Account is not active');
        }

        // Verify password
        const isPasswordValid = await PasswordUtil.compare(command.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Generate JWT token
        const token = this.jwtUtil.generateToken(user.id as number, user.email);
        const expiresAt = this.jwtUtil.getExpirationDate();

        // Create session in database
        const session = Session.create(
            user.id as number,
            token,
            expiresAt,
            command.deviceInfo,
            command.ipAddress,
        );

        await this.sessionRepository.create(session);

        return {
            token,
            expiresAt,
            user: {
                id: user.id as number,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        };
    }
}

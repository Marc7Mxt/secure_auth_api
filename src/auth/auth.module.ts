import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionOrmEntity } from './infrastructure/persistence/session.orm-entity.js';
import { TypeOrmSessionRepository } from './infrastructure/persistence/typeorm-session.repository.js';
import { SESSION_REPOSITORY } from './domain/session.repository.js';
import { LoginHandler } from './application/commands/login.handler.js';
import { LogoutHandler } from './application/commands/logout.handler.js';
import { JwtUtil } from './infrastructure/jwt.util.js';
import { AuthController } from './infrastructure/http/auth.controller.js';
import { UsersModule } from '../users/users.module.js';

const CommandHandlers = [LoginHandler, LogoutHandler];

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([SessionOrmEntity]),
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
            signOptions: { expiresIn: '24h' },
        }),
        UsersModule,
    ],
    controllers: [AuthController],
    providers: [
        ...CommandHandlers,
        JwtUtil,
        {
            provide: SESSION_REPOSITORY,
            useClass: TypeOrmSessionRepository,
        },
    ],
    exports: [JwtUtil, SESSION_REPOSITORY],
})
export class AuthModule {}

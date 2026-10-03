import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { LogoutCommand } from './logout.command.js';
import { SESSION_REPOSITORY } from '../../domain/session.repository.js';
import type { SessionRepository } from '../../domain/session.repository.js';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand, void> {
    constructor(
        @Inject(SESSION_REPOSITORY)
        private readonly sessionRepository: SessionRepository,
    ) {}

    async execute(command: LogoutCommand): Promise<void> {
        // Find and revoke session
        const session = await this.sessionRepository.findById(command.sessionId);
        if (!session) {
            throw new NotFoundException('Session not found');
        }

        await this.sessionRepository.revokeSession(command.sessionId);
    }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, BadRequestException } from '@nestjs/common';
import { CreateUserCommand } from './create-user.command.js';
import { User } from '../../domain/user.entity.js';
import { USER_REPOSITORY } from '../../domain/user.repository.js';
import type { UserRepository } from '../../domain/user.repository.js';
import { PasswordUtil } from '../../../shared/utils/password.util.js';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(command: CreateUserCommand): Promise<number> {
        // Check if user already exists
        const existing = await this.userRepository.findByEmail(command.email);
        if (existing) {
            throw new BadRequestException(`User with email ${command.email} already exists`);
        }

        // Hash the password
        const hashedPassword = await PasswordUtil.hash(command.password);

        // Create user with hashed password
        const user = new User(
            null,
            command.firstName,
            command.lastName,
            command.email,
            hashedPassword,
            command.isActive,
            new Date(),
        );

        // Save user
        const savedUser = await this.userRepository.save(user);

        return savedUser.id as number;
    }
}

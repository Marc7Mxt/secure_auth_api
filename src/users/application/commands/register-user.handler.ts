import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, BadRequestException } from '@nestjs/common';
import { RegisterUserCommand } from './register-user.command.js';
import { User } from '../../domain/user.entity.js';
import { USER_REPOSITORY } from '../../domain/user.repository.js';
import type { UserRepository } from '../../domain/user.repository.js';
import { PasswordUtil } from '../../../shared/utils/password.util.js';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(command: RegisterUserCommand): Promise<number> {
        // Validate password strength
        const passwordValidation = PasswordUtil.validateStrength(command.password);
        if (!passwordValidation.isValid) {
            throw new BadRequestException(passwordValidation.message);
        }

        // Check if user already exists
        const existing = await this.userRepository.findByEmail(command.email);
        if (existing) {
            throw new BadRequestException(`Email ${command.email} is already registered`);
        }

        // Hash the password
        const hashedPassword = await PasswordUtil.hash(command.password);

        // Create user with hashed password - isActive is false for registration
        const user = new User(
            null,
            command.firstName,
            command.lastName,
            command.email,
            hashedPassword,
            false, // isActive = false until email is verified
            new Date(),
        );

        // Save user
        const savedUser = await this.userRepository.save(user);

        return savedUser.id as number;
    }
}

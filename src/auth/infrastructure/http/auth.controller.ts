import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginDto } from './dto/login.dto.js';
import { LogoutDto } from './dto/logout.dto.js';
import { LoginCommand } from '../../application/commands/login.command.js';
import { LogoutCommand } from '../../application/commands/logout.command.js';
import type { LoginResult } from '../../application/commands/login.handler.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post('login')
    @HttpCode(200)
    async login(@Body() dto: LoginDto): Promise<LoginResult> {
        return this.commandBus.execute(
            new LoginCommand(
                dto.email,
                dto.password,
                dto.deviceInfo,
                dto.ipAddress,
            ),
        );
    }

    @Post('logout')
    @HttpCode(204)
    async logout(@Body() dto: LogoutDto): Promise<void> {
        return this.commandBus.execute(new LogoutCommand(dto.sessionId));
    }
}

import { Controller, Post, Body, HttpCode } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { CreateUserCommand } from "../../application/commands/create-user.command.js";
import { RegisterUserCommand } from "../../application/commands/register-user.command.js";

@Controller('users')
export class UsersController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post('register')
    @HttpCode(201)
    async register(@Body() dto: CreateUserDto): Promise<{ id: number }> {
        const id = await this.commandBus.execute(
            new RegisterUserCommand(
                dto.firstName,
                dto.lastName,
                dto.email,
                dto.password,
            ),
        );
        return { id };
    }

    @Post()
    @HttpCode(201)
    async create(@Body() dto: CreateUserDto): Promise<{ id: number }> {
        const id = await this.commandBus.execute(
            new CreateUserCommand(
                dto.firstName,
                dto.lastName,
                dto.email,
                dto.password,
                dto.isActive,
            ),
        );
        return { id };
    }
}
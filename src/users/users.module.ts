import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserOrmEntity } from "./infraestructure/persistence/user.orm-entity.js";
import { TypeOrmUserRepository } from "./infraestructure/persistence/typeorm-user.repository.js";
import { USER_REPOSITORY } from "./domain/user.repository.js";
import { CreateUserHandler } from "./application/commands/create-user.handler.js";
import { RegisterUserHandler } from "./application/commands/register-user.handler.js";
import { UsersController } from "./infraestructure/http/users.controller.js";

const CommandHandlers = [CreateUserHandler, RegisterUserHandler];

@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([UserOrmEntity])],
    controllers: [UsersController],
    providers: [
        ...CommandHandlers,
        {
            provide: USER_REPOSITORY,
            useClass: TypeOrmUserRepository,
        },
    ],
    exports: [USER_REPOSITORY],
})
export class UsersModule {}
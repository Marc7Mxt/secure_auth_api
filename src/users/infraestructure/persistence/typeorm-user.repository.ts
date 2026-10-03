import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserRepository } from "../../domain/user.repository.js";
import { User } from "../../domain/user.entity.js";
import { UserOrmEntity } from "./user.orm-entity.js";

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly ormRepo: Repository<UserOrmEntity>,
    ) {}

    async findById(id: number): Promise<User | null> {
        const record = await this.ormRepo.findOneBy({ id });
        return record ? this.toDomain(record) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const record = await this.ormRepo.findOneBy({ email });
        return record ? this.toDomain(record) : null;
    }

    async save(user: User): Promise<User> {
        const ormEntity = this.toOrm(user);
        const savedOrmEntity = await this.ormRepo.save(ormEntity);
        return this.toDomain(savedOrmEntity);
    }

    private toDomain(record: UserOrmEntity): User {
        return new User(record.id, record.firstName, record.lastName, record.email, record.password, record.isActive, record.createdAt);
    }

    private toOrm(user: User): UserOrmEntity {
        const entity = new UserOrmEntity();
        if (user.id !== null && user.id !== undefined) {
            entity.id = user.id;
        }
        entity.firstName = user.firstName;
        entity.lastName = user.lastName;
        entity.email = user.email;
        entity.password = user.password;
        entity.isActive = user.isActive;
        
        return entity;
    }
}
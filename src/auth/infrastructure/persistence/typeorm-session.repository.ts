import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { SessionOrmEntity } from './session.orm-entity.js';
import { SessionRepository } from '../../domain/session.repository.js';
import { Session } from '../../domain/session.entity.js';

@Injectable()
export class TypeOrmSessionRepository implements SessionRepository {
    constructor(
        @InjectRepository(SessionOrmEntity)
        private readonly ormRepo: Repository<SessionOrmEntity>,
    ) {}

    async create(session: Session): Promise<Session> {
        const ormEntity = this.toOrm(session);
        const savedOrmEntity = await this.ormRepo.save(ormEntity);
        return this.toDomain(savedOrmEntity);
    }

    async findById(id: string): Promise<Session | null> {
        const record = await this.ormRepo.findOneBy({ id });
        return record ? this.toDomain(record) : null;
    }

    async findByToken(token: string): Promise<Session | null> {
        const record = await this.ormRepo.findOneBy({ token });
        return record ? this.toDomain(record) : null;
    }

    async findActiveSessionsByUserId(userId: number): Promise<Session[]> {
        const records = await this.ormRepo.find({
            where: {
                userId,
                revokedAt: IsNull(),
            },
        });
        return records.map((record) => this.toDomain(record));
    }

    async update(session: Session): Promise<Session> {
        const ormEntity = this.toOrm(session);
        const updatedOrmEntity = await this.ormRepo.save(ormEntity);
        return this.toDomain(updatedOrmEntity);
    }

    async revokeSession(sessionId: string): Promise<void> {
        await this.ormRepo.update(sessionId, {
            revokedAt: new Date(),
        });
    }

    async revokeAllUserSessions(userId: number): Promise<void> {
        await this.ormRepo.update(
            { userId },
            {
                revokedAt: new Date(),
            },
        );
    }

    private toDomain(record: SessionOrmEntity): Session {
        return new Session(
            record.id,
            record.userId,
            record.token,
            record.expiresAt,
            record.revokedAt,
            record.lastActivityAt,
            record.deviceInfo,
            record.ipAddress,
            record.createdAt,
        );
    }

    private toOrm(session: Session): SessionOrmEntity {
        const entity = new SessionOrmEntity();
        if (session.id) {
            entity.id = session.id;
        }
        entity.userId = session.userId;
        entity.token = session.token;
        entity.expiresAt = session.expiresAt;
        entity.revokedAt = session.revokedAt;
        entity.lastActivityAt = session.lastActivityAt;
        entity.deviceInfo = session.deviceInfo;
        entity.ipAddress = session.ipAddress;
        entity.createdAt = session.createdAt;

        return entity;
    }
}

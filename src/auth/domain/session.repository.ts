import { Session } from './session.entity.js';

export interface SessionRepository {
    create(session: Session): Promise<Session>;
    findById(id: string): Promise<Session | null>;
    findByToken(token: string): Promise<Session | null>;
    findActiveSessionsByUserId(userId: number): Promise<Session[]>;
    update(session: Session): Promise<Session>;
    revokeSession(sessionId: string): Promise<void>;
    revokeAllUserSessions(userId: number): Promise<void>;
}

export const SESSION_REPOSITORY = Symbol('SESSION_REPOSITORY');

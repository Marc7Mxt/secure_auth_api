export class Session {
    constructor(
        public readonly id: string | null,
        public readonly userId: number,
        public readonly token: string,
        public readonly expiresAt: Date,
        public readonly revokedAt: Date | null,
        public readonly lastActivityAt: Date,
        public readonly deviceInfo: string | null,
        public readonly ipAddress: string | null,
        public readonly createdAt: Date,
    ) {}

    static create(
        userId: number,
        token: string,
        expiresAt: Date,
        deviceInfo?: string,
        ipAddress?: string,
    ): Session {
        return new Session(
            null,
            userId,
            token,
            expiresAt,
            null,
            new Date(),
            deviceInfo || null,
            ipAddress || null,
            new Date(),
        );
    }

    isActive(): boolean {
        return this.revokedAt === null && this.expiresAt > new Date();
    }

    isExpired(): boolean {
        return this.expiresAt <= new Date();
    }
}

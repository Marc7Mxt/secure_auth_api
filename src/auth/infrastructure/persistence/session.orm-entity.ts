import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { UserOrmEntity } from '../../../users/infraestructure/persistence/user.orm-entity.js';

@Entity('sessions')
@Index(['userId'])
@Index(['token'])
@Index(['userId', 'revokedAt'])
export class SessionOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: number;

    @Column({ type: 'varchar', length: 500 })
    token: string;

    @Column({ type: 'datetime' })
    expiresAt: Date;

    @Column({ type: 'datetime', nullable: true })
    revokedAt: Date | null;

    @Column({ type: 'datetime' })
    lastActivityAt: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    deviceInfo: string | null;

    @Column({ type: 'varchar', length: 45, nullable: true })
    ipAddress: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: UserOrmEntity;
}



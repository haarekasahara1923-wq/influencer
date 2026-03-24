import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CampaignApplication } from '../../campaigns/entities/application.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  HELD = 'held',
  APPROVED = 'approved',
  RELEASED = 'released',
  DISPUTED = 'disputed',
  REFUNDED = 'refunded',
}

export enum DealStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CampaignApplication, (app) => app.id)
  @JoinColumn({ name: 'applicationId' })
  applicationId: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'businessId' })
  businessId: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'influencerId' })
  influencerId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  platformCommission: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  influencerAmount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: 'enum',
    enum: DealStatus,
    default: DealStatus.ACTIVE,
  })
  dealStatus: DealStatus;

  @Column({ nullable: true })
  razorpayOrderId: string;

  @Column({ nullable: true })
  razorpayPaymentId: string;

  @Column({ nullable: true })
  razorpayPayoutId: string;

  @Column({ type: 'jsonb', nullable: true })
  paymentLogs: {
    event: string;
    timestamp: Date;
    details?: any;
  }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

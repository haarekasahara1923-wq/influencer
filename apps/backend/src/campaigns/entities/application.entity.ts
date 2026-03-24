import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Campaign } from './campaign.entity';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  NEGOTIATING = 'NEGOTIATING',
  ESCROW_STARTED = 'ESCROW_STARTED',
  COMPLETED = 'COMPLETED',
}

@Entity('campaign_applications')
@Unique(['campaignId', 'influencerId'])
export class CampaignApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Campaign, (campaign) => campaign.id)
  @JoinColumn({ name: 'campaignId' })
  campaignId: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'influencerId' })
  influencerId: string;

  @Column({ type: 'text', nullable: true })
  proposalMessage: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  bidAmount: number;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column({ type: 'jsonb', nullable: true })
  milestones: {
    title: string;
    amount: number;
    completed: boolean;
    escrowReleased: boolean;
  }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

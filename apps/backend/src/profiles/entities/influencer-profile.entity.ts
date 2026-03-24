import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('influencer_profiles')
export class InfluencerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  userId: string;

  @Column({ nullable: true })
  niche: string; // e.g. Fashion, Tech

  @Column({ type: 'jsonb', nullable: true })
  socialPlatforms: {
    platform: string; // e.g. Instagram, TikTok
    handle: string;
    followerCount: number;
    engagementRate?: number;
    profileUrl?: string;
  }[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  basePrice: number;

  @Column({ type: 'jsonb', nullable: true })
  dnaData: {
    audienceDemographics?: any;
    topNiches?: string[];
    aiAnalysis?: string;
    score?: number;
  };

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

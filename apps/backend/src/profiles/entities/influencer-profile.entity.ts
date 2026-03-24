import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('influencer_profiles')
export class InfluencerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ nullable: true })
  niche: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  contactNo: string;

  @Column({ nullable: true })
  whatsappNo: string;

  @Column({ type: 'jsonb', nullable: true })
  socialPlatforms: {
    platform: string; 
    handle: string;
    followerCount: number;
    views?: number;
    likes?: number;
    comments?: number;
    profileUrl?: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  creatives: {
    type: 'video' | 'image';
    url: string;
    brandName?: string;
  }[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  basePrice: number;

  @Column({ type: 'jsonb', nullable: true })
  dnaData: {
    audienceDemographics?: any;
    topNiches?: string[];
    aiAnalysis?: string;
    score?: number;
    generatedBios?: string[];
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

import { Controller, Post, Body, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Campaign } from '../campaigns/entities/campaign.entity';
import { Payment } from '../payments/entities/payment.entity';
import { InfluencerProfile } from '../profiles/entities/influencer-profile.entity';
import { BusinessProfile } from '../profiles/entities/business-profile.entity';

@Controller('admin')
export class AdminDataController {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Campaign) private readonly campaignRepo: Repository<Campaign>,
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(InfluencerProfile) private readonly profileRepo: Repository<InfluencerProfile>,
    @InjectRepository(BusinessProfile) private readonly businessRepo: Repository<BusinessProfile>,
  ) {}

  @Post('login-data')
  async getDashboardData(@Body() body: any) {
    if (body.email !== process.env.ADMIN_EMAIL || body.password !== process.env.ADMIN_PASSWORD) {
       throw new UnauthorizedException('Invalid Admin Credentials');
    }

    try {
      const users = await this.userRepo.find({ order: { createdAt: 'DESC' } });
      const campaigns = await this.campaignRepo.find({ relations: ['businessId'], order: { createdAt: 'DESC' } });
      const payments = await this.paymentRepo.find({ relations: ['businessId', 'influencerId'], order: { createdAt: 'DESC' } });
      const profiles = await this.profileRepo.find({ relations: ['user'] });
      const businesses = await this.businessRepo.find({ relations: ['user'] });

      return {
        users,
        campaigns,
        payments,
        profiles,
        businesses
      };
    } catch (e) {
      throw new HttpException('Database error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

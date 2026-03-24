import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminDataController } from './admin-data.controller';
import { AdminEscrowController } from './admin-escrow.controller';
import { User } from '../users/entities/user.entity';
import { Campaign } from '../campaigns/entities/campaign.entity';
import { Payment } from '../payments/entities/payment.entity';
import { InfluencerProfile } from '../profiles/entities/influencer-profile.entity';
import { BusinessProfile } from '../profiles/entities/business-profile.entity';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Campaign, Payment, InfluencerProfile, BusinessProfile]),
    PaymentsModule,
  ],
  controllers: [AdminDataController, AdminEscrowController],
})
export class AdminModule {}

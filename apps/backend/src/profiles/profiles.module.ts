import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { InfluencerProfile } from './entities/influencer-profile.entity';
import { BusinessProfile } from './entities/business-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InfluencerProfile, BusinessProfile]),
  ],
  providers: [ProfilesService],
  controllers: [ProfilesController],
  exports: [ProfilesService],
})
export class ProfilesModule {}

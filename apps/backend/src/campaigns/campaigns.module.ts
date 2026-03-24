import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignsController } from './campaigns.controller';
import { Campaign } from './entities/campaign.entity';
import { CampaignApplication } from './entities/application.entity';
import { MatchingEngineService } from '../ai/matching-engine.service';
import { InfluencerProfile } from '../profiles/entities/influencer-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign, CampaignApplication, InfluencerProfile]),
  ],
  providers: [MatchingEngineService],
  controllers: [CampaignsController],
  exports: [MatchingEngineService],
})
export class CampaignsModule {}

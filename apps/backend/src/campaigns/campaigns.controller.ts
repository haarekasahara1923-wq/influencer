import { Controller, Get, Param, UseGuards, Inject } from '@nestjs/common';
import { MatchingEngineService } from '../ai/matching-engine.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from './entities/campaign.entity';

@Controller('campaigns')
export class CampaignsController {
  constructor(
    private matchingEngine: MatchingEngineService,
    @InjectRepository(Campaign)
    private campaignRepo: Repository<Campaign>,
  ) {}

  @Get()
  async getAll() {
    return this.campaignRepo.find({ relations: ['businessId'] });
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.campaignRepo.findOne({ where: { id }, relations: ['businessId'] });
  }

  /**
   * AI Recommended Influencers for a specific Campaign
   */
  @UseGuards(JwtAuthGuard)
  @Get(':campaignId/recommendations')
  async getRecommendations(@Param('campaignId') campaignId: string) {
    return this.matchingEngine.findMatchesForCampaign(campaignId);
  }
}

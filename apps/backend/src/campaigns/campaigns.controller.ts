import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MatchingEngineService } from '../ai/matching-engine.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('campaigns')
@UseGuards(JwtAuthGuard)
export class CampaignsController {
  constructor(private matchingEngine: MatchingEngineService) {}

  /**
   * AI Recommended Influencers for a specific Campaign
   */
  @Get(':campaignId/recommendations')
  async getRecommendations(@Param('campaignId') campaignId: string) {
    return this.matchingEngine.findMatchesForCampaign(campaignId);
  }
}

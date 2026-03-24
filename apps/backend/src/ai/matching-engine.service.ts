import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from '../campaigns/entities/campaign.entity';
import { InfluencerProfile } from '../profiles/entities/influencer-profile.entity';

@Injectable()
export class MatchingEngineService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepo: Repository<Campaign>,
    @InjectRepository(InfluencerProfile)
    private influencerRepo: Repository<InfluencerProfile>,
  ) {}

  /**
   * AI-driven Matching Algorithm
   * Calculates a score out of 100 based on niche, reach, and pricing affinity.
   */
  async findMatchesForCampaign(campaignId: string) {
    const campaign = await this.campaignRepo.findOne({ where: { id: campaignId } });
    if (!campaign) return [];

    const influencers = await this.influencerRepo.find();
    
    const matchedInfluencers = influencers.map((influencer) => {
      let score = 0;

      // 1. Niche Match (Weight: 40)
      const campaignNiches = campaign.requirements?.niche || [];
      if (campaignNiches.includes(influencer.niche)) {
        score += 40;
      } else {
        // Partial match check could be added here
      }

      // 2. Reach/Followers Affinity (Weight: 30)
      const minFollowers = campaign.requirements?.minFollowers || 0;
      const influencerReach = influencer.socialPlatforms?.reduce((acc, p) => acc + (p.followerCount || 0), 0) || 0;
      
      if (influencerReach >= minFollowers) {
        score += 30;
      } else if (influencerReach >= minFollowers * 0.8) {
        score += 15; // Partial reach match
      }

      // 3. Pricing Compatibility (Weight: 20)
      const budgetPerInfluencer = campaign.totalBudget / 5; // Assuming 5 influencers per campaign
      if (influencer.basePrice <= budgetPerInfluencer) {
        score += 20;
      } else if (influencer.basePrice <= budgetPerInfluencer * 1.5) {
        score += 10;
      }

      // 4. DNA Quality Score (Weight: 10)
      const dnaQuality = influencer.dnaData?.score || 0;
      score += (dnaQuality / 100) * 10;

      return {
        ...influencer,
        matchScore: Math.ceil(score),
        compatibilityDetails: {
          nicheMatch: campaignNiches.includes(influencer.niche),
          reachMatch: influencerReach >= minFollowers,
          priceMatch: influencer.basePrice <= budgetPerInfluencer,
        }
      };
    });

    // Sort by descending match score
    return matchedInfluencers
      .filter(i => i.matchScore > 10)
      .sort((a, b) => b.matchScore - a.matchScore);
  }
}

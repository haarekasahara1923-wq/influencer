import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InfluencerProfile } from './entities/influencer-profile.entity';
import { BusinessProfile } from './entities/business-profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(InfluencerProfile)
    private influencerRepo: Repository<InfluencerProfile>,
    @InjectRepository(BusinessProfile)
    private businessRepo: Repository<BusinessProfile>,
  ) {}

  async createOrUpdateInfluencerProfile(userId: string, data: Partial<InfluencerProfile>) {
    let profile = await this.influencerRepo.findOne({ where: { userId } });
    
    if (profile) {
      Object.assign(profile, data);
    } else {
      profile = this.influencerRepo.create({ ...data, userId });
    }
    
    // Simulate DNA Analysis (Phase 4 AI part)
    if (profile.socialPlatforms?.length > 0) {
      const totalFollowers = profile.socialPlatforms.reduce((acc, p) => acc + (p.followerCount || 0), 0);
      profile.basePrice = this.calculateAiPricing(totalFollowers);
      profile.dnaData = {
        ...profile.dnaData,
        score: Math.min(Math.ceil((totalFollowers / 100000) * 100), 100),
        topNiches: [profile.niche, 'Lifestyle'].filter(Boolean),
        aiAnalysis: "Verified identity and high engagement detected."
      };
    }

    return this.influencerRepo.save(profile);
  }

  async generateAIBios(userId: string, rawBio: string) {
    const profile = await this.getInfluencer(userId);
    if (!profile) throw new NotFoundException('Profile not found. Please create your profile first.');
    
    // In a real implementation, we'd call an LLM here.
    // For now, we simulate 3 variations based on the rawBio.
    const variations = [
      `✨ ${rawBio} | Passionate about creating impact and connecting brands with authentic stories. 🚀`,
      `Verified Creator 🌟. ${rawBio} - Specialized in high-engagement content and lifestyle aesthetics. DM for Collabs. 📩`,
      `Helping brands grow through the lens of ${profile.niche || 'creativity'}. 💎 ${rawBio} | Content Strategist & Influencer.`
    ];

    profile.dnaData = {
      ...profile.dnaData,
      generatedBios: variations
    };

    await this.influencerRepo.save(profile);
    return variations;
  }

  async createBusinessProfile(userId: string, data: Partial<BusinessProfile>) {
    const profile = this.businessRepo.create({ ...data, userId });
    return this.businessRepo.save(profile);
  }

  async getInfluencer(userId: string) {
    return this.influencerRepo.findOne({ where: { userId } });
  }

  async getPublicInfluencer(userId: string) {
    const profile = await this.influencerRepo.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');
    
    // Strip sensitive fields
    const { contactNo, whatsappNo, contactEmail, address, ...publicData } = profile;
    return publicData;
  }

  private calculateAiPricing(followers: number) {
    // Basic Tring-style pricing logic
    if (followers < 10000) return 1500;
    if (followers < 50000) return 5000;
    if (followers < 100000) return 12000;
    return Math.ceil(followers * 0.15); // ₹0.15 per follower for mega influencers
  }
}

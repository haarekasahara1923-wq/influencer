import { Controller, Post, Body, Get, UseGuards, Req, Put } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InfluencerProfile } from './entities/influencer-profile.entity';
import { BusinessProfile } from './entities/business-profile.entity';

@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Post('influencer')
  async createInfluencer(
    @Req() req,
    @Body() data: Partial<InfluencerProfile>,
  ) {
    return this.profilesService.createInfluencerProfile(req.user.id, data);
  }

  @Post('business')
  async createBusiness(
    @Req() req,
    @Body() data: Partial<BusinessProfile>,
  ) {
    return this.profilesService.createBusinessProfile(req.user.id, data);
  }

  @Get('me')
  async getMyProfile(@Req() req) {
    return this.profilesService.getInfluencer(req.user.id);
  }
}

import { Controller, Post, Body, Get, UseGuards, Req, Put, Param, NotFoundException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InfluencerProfile } from './entities/influencer-profile.entity';
import { BusinessProfile } from './entities/business-profile.entity';
import { CloudinaryProvider } from './cloudinary.provider';

@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(
    private profilesService: ProfilesService,
    private cloudinary: CloudinaryProvider
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // With multer-storage-cloudinary, the file.path will be the Cloudinary URL
    return { url: file.path };
  }

  @Post('influencer')
  async createOrUpdateInfluencer(
    @Req() req,
    @Body() data: Partial<InfluencerProfile>,
  ) {
    return this.profilesService.createOrUpdateInfluencerProfile(req.user.id, data);
  }

  @Post('ai/generate-bio')
  async generateBio(
    @Req() req,
    @Body('rawBio') rawBio: string,
  ) {
    return this.profilesService.generateAIBios(req.user.id, rawBio);
  }

  @Post('business')
  async createBusiness(
    @Req() req,
    @Body() data: Partial<BusinessProfile>,
  ) {
    return this.profilesService.createBusinessProfile(req.user.id, data);
  }

  @Get('influencer/:userId')
  async getPublicProfile(@Param('userId') userId: string) {
    return this.profilesService.getPublicInfluencer(userId);
  }

  @Get('me')
  async getMyProfile(@Req() req) {
    const profile = await this.profilesService.getInfluencer(req.user.id);
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }
}

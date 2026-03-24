import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { InfluencerProfile } from './entities/influencer-profile.entity';
import { BusinessProfile } from './entities/business-profile.entity';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([InfluencerProfile, BusinessProfile]),
    MulterModule.registerAsync({
      useFactory: (cloudinary: CloudinaryProvider) => ({
        storage: cloudinary.storage,
      }),
      inject: [CloudinaryProvider],
    }),
  ],
  providers: [ProfilesService, CloudinaryProvider],
  controllers: [ProfilesController],
  exports: [ProfilesService, CloudinaryProvider],
})
export class ProfilesModule {}

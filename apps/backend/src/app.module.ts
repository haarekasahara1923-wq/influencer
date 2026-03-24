import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/entities/user.entity';
import { InfluencerProfile } from './profiles/entities/influencer-profile.entity';
import { BusinessProfile } from './profiles/entities/business-profile.entity';
import { Campaign } from './campaigns/entities/campaign.entity';
import { CampaignApplication } from './campaigns/entities/application.entity';
import { Payment } from './payments/entities/payment.entity';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { PaymentsModule } from './payments/payments.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { CommunicationModule } from './communication/communication.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.example', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [User, InfluencerProfile, BusinessProfile, Campaign, CampaignApplication, Payment],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    AuthModule,
    ProfilesModule,
    PaymentsModule,
    CampaignsModule,
    CommunicationModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

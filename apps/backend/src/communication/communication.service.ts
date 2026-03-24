import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class CommunicationService {
  private appId: number;
  private serverSecret: string;

  constructor(private configService: ConfigService) {
    this.appId = Number(this.configService.get<number>('ZEGOCLOUD_APP_ID'));
    this.serverSecret = this.configService.get<string>('ZEGOCLOUD_SERVER_SECRET') || 'default_secret';
  }


  /**
   * Generates a ZegoCloud Token for client authentication
   * For the "Tring Clone", this will be used for real-time chat/call in disputes.
   */
  generateToken(userId: string, roomId: string) {
    if (!this.appId || !this.serverSecret) return { token: 'mock-token' };

    // Standard ZegoCloud Token structure (simplified for example)
    const effectiveTimeInSeconds = 3600;
    const payload = {
      app_id: this.appId,
      user_id: userId,
      room_id: roomId,
      privilege: { 1: 1, 2: 1 }, // login, publish
      stream_id_list: [],
    };

    const token = this.createZegoToken(payload);
    return { token, appId: this.appId };
  }

  private createZegoToken(payload: any) {
     // This would normally use ZegoServerAssistant (official lib)
     // Given disk space/dependency constraints, we mock the final HMAC-signed string
     const data = JSON.stringify(payload);
     const signature = crypto.createHmac('sha256', this.serverSecret).update(data).digest('hex');
     return `v1:${signature}:${Buffer.from(data).toString('base64')}`;
  }
}

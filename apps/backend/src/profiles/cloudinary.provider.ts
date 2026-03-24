import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryProvider {
  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('CLOUDINARY_URL');
    if (url) {
      // cloudinary://key:secret@name
      const parts = url.replace('cloudinary://', '').split('@');
      const auth = parts[0].split(':');
      const name = parts[1];

      cloudinary.config({
        cloud_name: name,
        api_key: auth[0],
        api_secret: auth[1],
      });
    }
  }

  get storage() {
    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'influencer_connect',
        allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov'],
        resource_type: 'auto',
      } as any,
    });
  }
}

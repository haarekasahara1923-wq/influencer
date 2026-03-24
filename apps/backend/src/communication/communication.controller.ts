import { Controller, Post, Body, UseGuards, Req, Param } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('communication')
@UseGuards(JwtAuthGuard)
export class CommunicationController {
  constructor(private commService: CommunicationService) {}

  /**
   * Generates a ZegoCloud Token for the current user in a specific room (e.g. Dispute Room)
   */
  @Post('token/:roomId')
  async getRoomToken(@Req() req, @Param('roomId') roomId: string) {
    return this.commService.generateToken(req.user.id, roomId);
  }
}

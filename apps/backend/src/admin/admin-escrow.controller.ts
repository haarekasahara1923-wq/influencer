import { Controller, Post, Body, Get, UseGuards, Req, Put, Param } from '@nestjs/common';
import { PaymentsService } from '../payments/payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin/escrow')
@UseGuards(JwtAuthGuard) // Add Admin role guard here
export class AdminEscrowController {
  constructor(private paymentsService: PaymentsService) {}

  @Get('pending-releases')
  async getPendingReleases() {
     // Return deals in HELD status that are awaiting admin action
     return []; // Mock list for now
  }

  /**
   * ADMIN MANUALLY DISPATCHES PAYMENT
   * On approval, the Razorpay Payouts API is triggered.
   */
  @Post('release/:paymentId')
  async dispatchPayout(@Param('paymentId') paymentId: string) {
    return this.paymentsService.adminPayout(paymentId);
  }

  @Post('resolve-dispute/:paymentId')
  async resolveDispute(
    @Param('paymentId') paymentId: string,
    @Body('resolution') resolution: 'RELEASE' | 'REFUND',
  ) {
    if (resolution === 'RELEASE') {
      return this.paymentsService.adminPayout(paymentId);
    } else {
       // Logic for Refund
       return { status: 'refunded' };
    }
  }
}

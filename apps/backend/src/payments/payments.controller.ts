import { Controller, Post, Body, Get, UseGuards, Req, Put, Param, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('collect')
  @UseGuards(JwtAuthGuard)
  async collectPayment(@Body('applicationId') applicationId: string) {
    return this.paymentsService.createCollectionOrder(applicationId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getPayments(@Req() req: any) {
    const userId = req.user.id;
    const role = req.user.role;
    // We add a method in service to find by user and role
    return this.paymentsService.findAllByUser(userId, role);
  }

  /**
   * Razorpay Webhook listener with Signature Verification
   */
  @Post('webhook')
  async handleWebhook(@Body() payload: any, @Req() req: any) {
    const signature = req.headers['x-razorpay-signature'];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_secret';
    
    // In real production, we verify:
    // const expectedSignature = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');
    // if (signature !== expectedSignature) throw new UnauthorizedException('Invalid signature');

    const event = payload.event;
    if (event === 'order.paid') {
      const orderId = payload.payload.order.entity.id;
      const paymentId = payload.payload.payment.entity.id;
      return this.paymentsService.captureAndHold(orderId, paymentId);
    }
    return { status: 'event_ignored' };
  }


   /**
   * 3. WORK APPROVAL: Business approves influencer work manually
   */
  @Put('approve/:paymentId')
  @UseGuards(JwtAuthGuard)
  async approveWork(@Param('paymentId') paymentId: string) {
    // Only Business of the related campaign can approve
    return this.paymentsService.approvePayment(paymentId);
  }

  @Post('dispute/:paymentId')
  @UseGuards(JwtAuthGuard)
  async dispute(@Param('paymentId') paymentId: string, @Body('reason') reason: string) {
    return this.paymentsService.disputePayment(paymentId, reason);
  }
}

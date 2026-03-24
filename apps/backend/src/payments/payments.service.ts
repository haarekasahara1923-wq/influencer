import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import { Payment, PaymentStatus, DealStatus } from './entities/payment.entity';
import { CampaignApplication, ApplicationStatus } from '../campaigns/entities/application.entity';

@Injectable()
export class PaymentsService {
  private razorpay: any;
  private commissionPercent: number;

  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    @InjectRepository(CampaignApplication)
    private applicationRepo: Repository<CampaignApplication>,
    private configService: ConfigService,
  ) {
    this.razorpay = new (Razorpay as any)({
      key_id: this.configService.get('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get('RAZORPAY_KEY_SECRET'),
    });
    this.commissionPercent = this.configService.get<number>('PLATFORM_COMMISSION_PERCENTAGE') || 10;
  }

  async findAllByUser(userId: string, role: string) {
    const query = this.paymentRepo.createQueryBuilder('payment')
      .leftJoinAndSelect('payment.applicationId', 'application')
      .leftJoinAndSelect('application.campaignId', 'campaign')
      .leftJoinAndSelect('payment.influencerId', 'influencer')
      .leftJoinAndSelect('payment.businessId', 'business');

    if (role === 'BUSINESS') {
      query.where('payment.businessId = :userId', { userId });
    } else {
      query.where('payment.influencerId = :userId', { userId });
    }

    return query.orderBy('payment.createdAt', 'DESC').getMany();
  }

  /**
   * 1. PAYMENT COLLECTION: Business pays via Razorpay
   */
  async createCollectionOrder(applicationId: string) {
    const application = await this.applicationRepo.findOne({ where: { id: applicationId } });
    if (!application) throw new NotFoundException('Application not found');

    const amount = Number(application.bidAmount) * 100; // in paise
    const order = await this.razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `recp_${application.id}`,
      notes: { applicationId: application.id },
    });

    const payment = this.paymentRepo.create({
      applicationId,
      businessId: (application as any).campaign?.businessId, // Linkage
      influencerId: application.influencerId,
      totalAmount: application.bidAmount,
      razorpayOrderId: order.id,
      paymentStatus: PaymentStatus.PENDING,
      paymentLogs: [{ event: 'order_created', timestamp: new Date(), details: order }],
    });

    await this.paymentRepo.save(payment);
    return order;
  }

  /**
   * 2. PAYMENT HOLD: On successful webhook from Razorpay
   */
  async captureAndHold(orderId: string, razorpayPaymentId: string) {
    const payment = await this.paymentRepo.findOne({ where: { razorpayOrderId: orderId } });
    if (!payment) throw new NotFoundException('Payment record not found');

    payment.paymentStatus = PaymentStatus.HELD;
    payment.dealStatus = DealStatus.ACTIVE;
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.paymentLogs.push({ event: 'payment_held', timestamp: new Date(), details: { razorpayPaymentId } });

    await this.paymentRepo.save(payment);

    // Update Application Status
    await this.applicationRepo.update(payment.applicationId, { status: ApplicationStatus.ESCROW_STARTED });

    return payment;
  }

  /**
   * 4. WORK APPROVAL: Business approves influencer work manually
   * Money moves from HELD to APPROVED.
   */
  async approvePayment(paymentId: string) {
    const payment = await this.paymentRepo.findOne({ where: { id: paymentId } });
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.paymentStatus !== PaymentStatus.HELD) throw new BadRequestException('Payment not in HELD status');

    payment.paymentStatus = PaymentStatus.APPROVED;
    payment.paymentLogs.push({ 
      event: 'payment_approved_by_business', 
      timestamp: new Date() 
    });

    return this.paymentRepo.save(payment);
  }

  /**
   * 5. ADMIN PAYOUT: Admin manually triggers the actual payout to the influencer
   * Money moves from APPROVED to RELEASED.
   */
  async adminPayout(paymentId: string) {
    const payment = await this.paymentRepo.findOne({ where: { id: paymentId } });
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.paymentStatus !== PaymentStatus.APPROVED) throw new BadRequestException('Only approved payments can be released by admin');

    const commission = (payment.totalAmount * this.commissionPercent) / 100;
    const influencerPayout = payment.totalAmount - commission;

    // Razorpay Payouts API simulation
    payment.platformCommission = commission;
    payment.influencerAmount = influencerPayout;
    payment.paymentStatus = PaymentStatus.RELEASED;
    payment.dealStatus = DealStatus.COMPLETED;
    payment.razorpayPayoutId = `payout_sim_${Date.now()}`;
    payment.paymentLogs.push({ 
      event: 'admin_released_payout', 
      timestamp: new Date(), 
      details: { commission, influencerPayout } 
    });

    await this.paymentRepo.save(payment);
    await this.applicationRepo.update(payment.applicationId, { status: ApplicationStatus.COMPLETED });

    return payment;
  }

  async disputePayment(paymentId: string, reason: string) {
     const payment = await this.paymentRepo.findOne({ where: { id: paymentId } });
     if (!payment) throw new NotFoundException('Payment not found');

     payment.paymentStatus = PaymentStatus.DISPUTED;
     payment.paymentLogs.push({ event: 'payment_disputed', timestamp: new Date(), details: { reason } });
     
     return this.paymentRepo.save(payment);
  }
}

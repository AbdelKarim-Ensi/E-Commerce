import {
  Controller,
  Post,
  Req,
  Headers,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { PaymentService } from '../payment.service';

@Controller('payments/webhooks')
export class StripeWebhookController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!req.rawBody) {
      throw new BadRequestException(
        'Raw body manquant — vérifie la config NestFactory',
      );
    }

    if (!signature) {
      throw new BadRequestException('Signature Stripe manquante');
    }

    return (this.paymentService as any).handleWebhookEvent(req.rawBody, signature);
  }
}
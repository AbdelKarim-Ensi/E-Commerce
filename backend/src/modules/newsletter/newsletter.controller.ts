import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { NewsletterService } from './newsletter.service';
import { SubscribeDto } from './dto/subscribe.dto';
import { UnsubscribeDto } from './dto/unsubscribe.dto';
import { BroadcastNewsletterDto } from './dto/broadcast-newsletter.dto';

@Controller('newsletter')
export class NewsletterController {
  constructor(private newsletterService: NewsletterService) {}

  // Public — n'importe quel visiteur peut s'inscrire
  @Post('subscribe')
  subscribe(@Body() dto: SubscribeDto) {
    return this.newsletterService.subscribe(dto.email);
  }

  // Public — lien cliquable en 1 clic depuis l'email (pas d'auth nécessaire)
  @Get('unsubscribe')
  unsubscribe(@Query() dto: UnsubscribeDto) {
    return this.newsletterService.unsubscribe(dto.email);
  }

  // Admin uniquement — déclenche l'envoi réel à tous les abonnés
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('broadcast')
  broadcast(@Body() dto: BroadcastNewsletterDto) {
    return this.newsletterService.broadcast(
      dto.subject,
      dto.message,
      dto.ctaLink,
      dto.ctaText,
    );
  }
}

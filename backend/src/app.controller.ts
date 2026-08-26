import { Controller, Get, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

 
  @Get('debug-sentry')
  triggerError() {
    if (process.env.NODE_ENV === 'production') {
      throw new NotFoundException();
    }
    throw new Error('Test Sentry - erreur déclenchée volontairement');
  }
}
import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';
import { frontendGuideHtml } from './guide/frontend-guide';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('guide')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getFrontendGuide(): string {
    return frontendGuideHtml;
  }
}

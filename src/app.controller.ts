import { Controller, Get, Header } from '@nestjs/common';
import { frontendGuideHtml } from './guide/frontend-guide';

@Controller()
export class AppController {
  @Get()
  getGuide(): string {
    return frontendGuideHtml;
  }

  @Get('guide')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getFrontendGuide(): string {
    return frontendGuideHtml;
  }
}

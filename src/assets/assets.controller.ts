import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { CreateValuationDto } from './dto/create-valuation.dto';

@UseGuards(JwtAuthGuard)
@Controller('assets')
export class AssetsController {
  constructor(private assetsService: AssetsService) {}

  @Post()
  create(@CurrentUser() user, @Body() dto: CreateAssetDto) {
    return this.assetsService.create(user.userId, dto);
  }

  @Get()
  findAll(
    @CurrentUser() user,
    @Query('type') type?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.assetsService.findAll(
      user.userId,
      type,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get('summary')
  getSummary(@CurrentUser() user) {
    return this.assetsService.getSummary(user.userId);
  }

  @Get(':id')
  findOne(@CurrentUser() user, @Param('id', ParseIntPipe) id: number) {
    return this.assetsService.findOne(user.userId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAssetDto,
  ) {
    return this.assetsService.update(user.userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user, @Param('id', ParseIntPipe) id: number) {
    return this.assetsService.remove(user.userId, id);
  }

  @Post(':id/valuations')
  addValuation(
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateValuationDto,
  ) {
    return this.assetsService.addValuation(user.userId, id, dto);
  }

  @Get(':id/performance')
  getPerformance(@CurrentUser() user, @Param('id', ParseIntPipe) id: number) {
    return this.assetsService.getPerformance(user.userId, id);
  }
}

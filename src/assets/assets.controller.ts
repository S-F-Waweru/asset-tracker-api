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
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { CreateValuationDto } from './dto/create-valuation.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformInterceptor)
@ApiTags('Assets')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Missing, expired, or invalid bearer token.',
})
@Controller('assets')
export class AssetsController {
  constructor(private assetsService: AssetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create an asset' })
  @ApiBody({ type: CreateAssetDto })
  @ApiCreatedResponse({ description: 'Asset created successfully.' })
  create(@CurrentUser() user, @Body() dto: CreateAssetDto) {
    return this.assetsService.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: "List the current user's assets" })
  @ApiQuery({
    name: 'type',
    required: false,
    example: 'stock',
    description: 'Filter assets by type.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    type: Number,
    description: 'Page number, starting at 1.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    type: Number,
    description: 'Maximum assets returned per page.',
  })
  @ApiOkResponse({
    description: 'Paginated asset list.',
    schema: { example: { items: [], total: 0, page: 1, limit: 10 } },
  })
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
  @ApiOperation({ summary: 'Get portfolio value summary' })
  @ApiOkResponse({
    description: 'Total portfolio value and value grouped by asset type.',
    schema: {
      example: {
        totalPortfolioValue: 2150,
        byType: { stock: 1855, crypto: 295 },
      },
    },
  })
  getSummary(@CurrentUser() user) {
    return this.assetsService.getSummary(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an asset by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'Asset ID.' })
  @ApiOkResponse({ description: 'Asset details, including valuations.' })
  @ApiNotFoundResponse({ description: 'Asset was not found.' })
  findOne(@CurrentUser() user, @Param('id', ParseIntPipe) id: number) {
    return this.assetsService.findOne(user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an asset' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'Asset ID.' })
  @ApiBody({ type: UpdateAssetDto })
  @ApiOkResponse({ description: 'Updated asset.' })
  @ApiNotFoundResponse({ description: 'Asset was not found.' })
  update(
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAssetDto,
  ) {
    return this.assetsService.update(user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an asset' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'Asset ID.' })
  @ApiOkResponse({
    description: 'Deleted asset ID.',
    schema: { example: { id: 1 } },
  })
  @ApiNotFoundResponse({ description: 'Asset was not found.' })
  remove(@CurrentUser() user, @Param('id', ParseIntPipe) id: number) {
    return this.assetsService.remove(user.userId, id);
  }

  @Post(':id/valuations')
  @ApiOperation({ summary: 'Record an asset valuation' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'Asset ID.' })
  @ApiBody({ type: CreateValuationDto })
  @ApiCreatedResponse({ description: 'Valuation recorded.' })
  @ApiNotFoundResponse({ description: 'Asset was not found.' })
  addValuation(
    @CurrentUser() user,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateValuationDto,
  ) {
    return this.assetsService.addValuation(user.userId, id, dto);
  }

  @Get(':id/performance')
  @ApiOperation({ summary: "Get an asset's performance" })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'Asset ID.' })
  @ApiOkResponse({
    description: 'Performance calculated from the latest valuation.',
    schema: {
      example: {
        assetId: 1,
        latestValue: 210.75,
        gainLoss: 252.5,
        gainLossPercent: 13.61,
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Asset was not found.' })
  getPerformance(@CurrentUser() user, @Param('id', ParseIntPipe) id: number) {
    return this.assetsService.getPerformance(user.userId, id);
  }
}

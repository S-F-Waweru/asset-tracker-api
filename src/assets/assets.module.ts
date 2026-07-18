import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';
import { AssetValuation } from './entities/asset-valuation.entity';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, AssetValuation])],
  providers: [AssetsService],
  controllers: [AssetsController],
})
export class AssetsModule {}

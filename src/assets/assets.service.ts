import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './entities/asset.entity';
import { AssetValuation } from './entities/asset-valuation.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { CreateValuationDto } from './dto/create-valuation.dto';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private assetsRepo: Repository<Asset>,
    @InjectRepository(AssetValuation)
    private valuationsRepo: Repository<AssetValuation>,
  ) {}

  async create(userId: number, dto: CreateAssetDto) {
    const asset = this.assetsRepo.create({ ...dto, userId });
    return this.assetsRepo.save(asset);
  }

  async findAll(userId: number, type?: string, page = 1, limit = 10) {
    const where: any = { userId };
    if (type) where.type = type;

    const [items, total] = await this.assetsRepo.findAndCount({
      where,
      relations: ['valuations'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { items, total, page, limit };
  }

  async findOne(userId: number, id: number) {
    const asset = await this.assetsRepo.findOne({
      where: { id, userId },
      relations: ['valuations'],
    });
    if (!asset) throw new NotFoundException('Asset not found');
    return asset;
  }

  async update(userId: number, id: number, dto: UpdateAssetDto) {
    const asset = await this.findOne(userId, id);
    Object.assign(asset, dto);
    return this.assetsRepo.save(asset);
  }

  async remove(userId: number, id: number) {
    const asset = await this.findOne(userId, id);
    await this.assetsRepo.remove(asset);
    return { id };
  }

  async addValuation(userId: number, id: number, dto: CreateValuationDto) {
    const asset = await this.findOne(userId, id);
    const valuation = this.valuationsRepo.create({
      value: dto.value,
      assetId: asset.id,
    });
    return this.valuationsRepo.save(valuation);
  }

  private getLatestValue(asset: Asset): number {
    if (!asset.valuations || asset.valuations.length === 0) {
      return asset.purchasePrice;
    }
    const latest = asset.valuations.reduce((a, b) =>
      new Date(a.recordedAt) > new Date(b.recordedAt) ? a : b,
    );
    return latest.value;
  }

  async getPerformance(userId: number, id: number) {
    const asset = await this.findOne(userId, id);
    const latestValue = this.getLatestValue(asset);
    const gainLoss = (latestValue - asset.purchasePrice) * asset.quantity;
    const gainLossPercent =
      ((latestValue - asset.purchasePrice) / asset.purchasePrice) * 100;

    return {
      assetId: asset.id,
      latestValue,
      gainLoss,
      gainLossPercent,
    };
  }

  async getSummary(userId: number) {
    const assets = await this.assetsRepo.find({
      where: { userId },
      relations: ['valuations'],
    });

    const byType: Record<string, number> = {};
    let totalPortfolioValue = 0;

    for (const asset of assets) {
      const latestValue = this.getLatestValue(asset);
      const contribution = asset.quantity * latestValue;
      byType[asset.type] = (byType[asset.type] || 0) + contribution;
      totalPortfolioValue += contribution;
    }

    return { totalPortfolioValue, byType };
  }
}

import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAssetDto {
  @ApiProperty({ example: 'Apple Inc.', description: 'Display name of the asset.' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'stock', description: 'Asset category, such as stock, crypto, or real-estate.' })
  @IsString()
  type: string;

  @ApiProperty({ example: 10, minimum: 0, description: 'Number of units owned.' })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ example: 185.5, minimum: 0, description: 'Purchase price per unit.' })
  @IsNumber()
  @Min(0)
  purchasePrice: number;

  @ApiPropertyOptional({ example: 'USD', description: 'ISO 4217 currency code. Defaults to USD.' })
  @IsOptional()
  @IsString()
  currency?: string;
}

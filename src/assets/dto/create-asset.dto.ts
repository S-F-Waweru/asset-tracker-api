import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateAssetDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @Min(0)
  purchasePrice: number;

  @IsOptional()
  @IsString()
  currency?: string;
}

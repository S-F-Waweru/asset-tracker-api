import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateValuationDto {
  @ApiProperty({ example: 210.75, minimum: 0, description: 'Current value per unit of the asset.' })
  @IsNumber()
  @Min(0)
  value: number;
}

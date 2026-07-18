import { IsNumber, Min } from 'class-validator';

export class CreateValuationDto {
  @IsNumber()
  @Min(0)
  value: number;
}

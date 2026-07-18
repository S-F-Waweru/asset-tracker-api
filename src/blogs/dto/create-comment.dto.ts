import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'This explanation of interceptors was really useful.' })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({ example: 'Understanding Angular HTTP interceptors' })
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  title: string;

  @ApiProperty({ example: 'Interceptors let an Angular app handle cross-cutting HTTP concerns in one place.' })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiPropertyOptional({ example: false, description: 'Publish immediately. Defaults to false (draft).' })
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}

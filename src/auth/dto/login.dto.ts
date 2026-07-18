import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'jane@example.com', description: 'Registered account email address.' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword123', description: 'Account password.' })
  @IsNotEmpty()
  password: string;
}

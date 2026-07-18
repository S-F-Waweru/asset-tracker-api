import { IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'jane@example.com',
    description: 'Unique email address for the account.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'securePassword123',
    minLength: 6,
    description: 'Account password; must contain at least 6 characters.',
  })
  @MinLength(6)
  password: string;
}

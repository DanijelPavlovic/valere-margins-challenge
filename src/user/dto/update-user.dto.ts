import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsOptional,
  Matches,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
    required: false,
  })
  @IsString()
  @MinLength(2)
  @Matches(/^[a-zA-Z]+$/, { message: 'First name must contain only letters' })
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @MinLength(2)
  @Matches(/^[a-zA-Z]+$/, { message: 'Last name must contain only letters' })
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    enumName: 'UserRole',
    example: UserRole.ADMIN,
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

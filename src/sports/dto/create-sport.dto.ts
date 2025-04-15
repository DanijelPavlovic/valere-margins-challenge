import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSportDto {
  @ApiProperty({
    description: 'The name of the sport',
    example: 'Tennis',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the sport',
    example:
      'A racket sport played between two players or two teams of two players each.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}

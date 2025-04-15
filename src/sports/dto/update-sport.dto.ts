import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateSportDto {
  @ApiProperty({
    description: 'The name of the sport',
    example: 'Tennis',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

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

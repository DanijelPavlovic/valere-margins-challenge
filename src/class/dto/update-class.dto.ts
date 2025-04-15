import {
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
  Min,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateScheduleDto } from './update-schedule.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClassDto {
  @ApiProperty({
    description: 'The name of the sports class',
    example: 'Beginner Tennis Class',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The description of the sports class',
    example:
      'A beginner-friendly tennis class focusing on basic techniques and rules.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The duration of the class in minutes',
    example: 60,
    minimum: 1,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  duration?: number;

  @ApiProperty({
    description: 'The schedules for the class',
    type: () => [UpdateScheduleDto],
    example: [
      {
        startDate: '2024-03-20',
      },
    ],
    required: false,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateScheduleDto)
  @IsOptional()
  schedules?: UpdateScheduleDto[];

  @ApiProperty({
    description: 'The maximum number of participants allowed in the class',
    example: 12,
    minimum: 1,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  maxParticipants?: number;

  @ApiProperty({
    description: 'Whether the class is active',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'The ID of the sport this class belongs to',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  sportId?: number;
}

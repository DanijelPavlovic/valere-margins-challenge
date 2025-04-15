import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
  Min,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateScheduleDto } from './create-schedule.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
  @ApiProperty({
    description: 'The name of the sports class',
    example: 'Beginner Tennis Class',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the sports class',
    example:
      'A beginner-friendly tennis class focusing on basic techniques and rules.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The duration of the class in minutes',
    example: 60,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({
    description: 'The schedules for the class',
    type: () => [CreateScheduleDto],
    example: [
      {
        startDate: '2024-03-20',
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateScheduleDto)
  schedules: CreateScheduleDto[];

  @ApiProperty({
    description: 'The maximum number of participants allowed in the class',
    example: 12,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  maxParticipants: number;

  @ApiProperty({
    description: 'Whether the class is active',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'The ID of the sport this class belongs to',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  sportId: number;
}

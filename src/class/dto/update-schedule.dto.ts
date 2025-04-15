import { IsDate, IsOptional, MinDate, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateScheduleDto {
  @ApiProperty({
    description: 'Start date of the class',
    example: '2024-03-20',
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ValidateIf(
    (o: UpdateScheduleDto) => {
      if (!o.startDate) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(o.startDate);
      inputDate.setHours(0, 0, 0, 0);
      return inputDate >= today;
    },
    {
      message: 'Start date must be in the future',
    },
  )
  startDate?: Date;
}

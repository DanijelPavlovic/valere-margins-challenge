import { IsDate, IsNotEmpty, MinDate, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({
    description: 'Start date of the class',
    example: '2024-03-20',
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  @ValidateIf(
    (o: CreateScheduleDto) => {
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
  startDate: Date;
}

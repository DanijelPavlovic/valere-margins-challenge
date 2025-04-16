import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SportsClass } from './sports-class.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Schedule {
  @ApiProperty({
    description: 'The unique identifier of the schedule',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'The start date of the class',
    example: '2024-04-20',
  })
  @Column({ type: 'date' })
  startDate: Date;

  @ApiProperty({
    description: 'The sports class this schedule belongs to',
    type: () => SportsClass,
  })
  @ManyToOne(() => SportsClass, (sportsClass) => sportsClass.schedules, {
    onDelete: 'CASCADE',
  })
  sportsClass: SportsClass;

  @ApiProperty({
    description: 'The date when the schedule was created',
    example: '2024-04-20T12:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the schedule was last updated',
    example: '2024-04-20T12:00:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}

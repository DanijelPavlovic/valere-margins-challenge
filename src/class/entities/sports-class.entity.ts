import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Sport } from '../../sports/entities/sports.entity';
import { ClassRegistration } from './class-registration.entity';
import { Schedule } from './schedule.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class SportsClass {
  @ApiProperty({
    description: 'The unique identifier of the sports class',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'The name of the sports class',
    example: 'Beginner Tennis Class',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'The description of the sports class',
    example:
      'A beginner-friendly tennis class focusing on basic techniques and rules.',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    description: 'The duration of the class in minutes',
    example: 60,
  })
  @Column()
  duration: number; // in minutes

  @ApiProperty({
    description: 'The maximum number of participants allowed in the class',
    example: 12,
  })
  @Column()
  maxParticipants: number;

  @ApiProperty({
    description: 'Whether the class is currently active',
    example: true,
    default: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'The ID of the sport this class belongs to',
    example: 1,
  })
  @Column()
  sportId: number;

  @ApiProperty({
    description: 'The sport associated with this class',
    type: () => Sport,
  })
  @ManyToOne(() => Sport, (sport) => sport.classes)
  @JoinColumn({ name: 'sportId' })
  sport: Sport;

  @ApiProperty({
    description: 'The registrations for this class',
    type: () => [ClassRegistration],
    required: false,
  })
  @OneToMany(
    () => ClassRegistration,
    (registration) => registration.sportsClass,
  )
  registrations: ClassRegistration[];

  @ApiProperty({
    description: 'The schedules for this class',
    type: () => [Schedule],
    required: false,
  })
  @OneToMany(() => Schedule, (schedule) => schedule.sportsClass)
  schedules: Schedule[];

  @ApiProperty({ description: 'The date when the class was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date when the class was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}

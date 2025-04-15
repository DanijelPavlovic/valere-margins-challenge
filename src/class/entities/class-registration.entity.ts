import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { SportsClass } from './sports-class.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ClassRegistration {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the registration' })
  id: number;

  @ManyToOne(() => User, (user) => user.registrations)
  @ApiProperty({
    description: 'The user who registered for the class',
    type: () => User,
  })
  user: User;

  @ManyToOne(() => SportsClass, (sportsClass) => sportsClass.registrations)
  @ApiProperty({
    description: 'The sports class the user registered for',
    type: () => SportsClass,
  })
  sportsClass: SportsClass;

  @Column({ default: false })
  @ApiProperty({
    description: 'Whether the registration is confirmed',
    default: false,
  })
  isConfirmed: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: 'The date when the registration was created' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description: 'The date when the registration was last updated',
  })
  updatedAt: Date;
}

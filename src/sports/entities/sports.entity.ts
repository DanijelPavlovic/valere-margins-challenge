import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SportsClass } from '../../class/entities/sports-class.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Sport {
  @ApiProperty({
    description: 'The unique identifier of the sport',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The name of the sport', example: 'Tennis' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({
    description: 'The description of the sport',
    example:
      'A racket sport played between two players or two teams of two players each.',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'The classes associated with this sport',
    type: () => [SportsClass],
    required: false,
  })
  @OneToMany(() => SportsClass, (sportsClass) => sportsClass.sport)
  classes: SportsClass[];

  @ApiProperty({ description: 'The date when the sport was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date when the sport was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportsService } from './sports.service';
import { SportsController } from './sports.controller';
import { Sport } from './entities/sports.entity';
import { SportsClass } from '../class/entities/sports-class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sport, SportsClass])],
  controllers: [SportsController],
  providers: [SportsService],
  exports: [SportsService],
})
export class SportsModule {}

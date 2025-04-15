import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportsClass } from './entities/sports-class.entity';
import { ClassRegistration } from './entities/class-registration.entity';
import { Schedule } from './entities/schedule.entity';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { UserModule } from '../user/user.module';
import { SportsModule } from '../sports/sports.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SportsClass, ClassRegistration, Schedule]),
    UserModule,
    SportsModule,
  ],
  controllers: [ClassController],
  providers: [ClassService],
  exports: [ClassService, TypeOrmModule],
})
export class ClassModule {}

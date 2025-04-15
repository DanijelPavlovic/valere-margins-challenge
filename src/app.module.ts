import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SportsModule } from './sports/sports.module';
import { ClassModule } from './class/class.module';
import databaseConfig from './configs/database.config';
import appConfig from './configs/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...(await configService.get('database')),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    SportsModule,
    ClassModule,
  ],
})
export class AppModule {}

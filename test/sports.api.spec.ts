import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateSportDto } from '../src/sports/dto/create-sport.dto';
import { UpdateSportDto } from '../src/sports/dto/update-sport.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { Sport } from '../src/sports/entities/sports.entity';
import { AuthService } from '../src/auth/auth.service';
import { UserRole } from '../src/user/enums/user-role.enum';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DataSource } from 'typeorm';

describe('Sports API (e2e)', () => {
  let app: NestExpressApplication;
  let createdSportId: number;
  let authService: AuthService;
  let jwtToken: string;
  let dataSource: DataSource;

  async function clearDatabase() {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');
      await queryRunner.query('DROP TABLE IF EXISTS `class_registration`');
      await queryRunner.query('DROP TABLE IF EXISTS `schedule`');
      await queryRunner.query('DROP TABLE IF EXISTS `sports_class`');
      await queryRunner.query('DROP TABLE IF EXISTS `sport`');
      await queryRunner.query('DROP TABLE IF EXISTS `user`');
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');

      // Recreate tables
      await dataSource.synchronize();

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'mysql',
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_DATABASE'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.setGlobalPrefix('api');
    await app.init();

    // Get the DataSource and AuthService
    dataSource = moduleFixture.get<DataSource>(DataSource);
    authService = moduleFixture.get<AuthService>(AuthService);

    // Clear the database
    await clearDatabase();

    // Create an admin user
    const adminUser: CreateUserDto = {
      email: 'admin@test.com',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    };

    await authService.register(adminUser);

    // Log in and get JWT token
    const { access_token } = await authService.login({
      email: adminUser.email,
      password: adminUser.password,
    });

    jwtToken = access_token;
  });

  afterAll(async () => {
    // Clear the database
    await clearDatabase();
    await app.close();
  });

  describe('POST /api/sports', () => {
    it('should create a new sport', async () => {
      const createSportDto: CreateSportDto = {
        name: 'Integration Test Sport',
        description: 'A sport created during integration testing',
      };

      const response = await request(app.getHttpServer())
        .post('/api/sports')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(createSportDto)
        .expect(201);

      const createdSport = response.body as Sport;
      expect(createdSport).toMatchObject({
        name: createSportDto.name,
        description: createSportDto.description,
      });
      expect(createdSport.id).toBeDefined();
      createdSportId = createdSport.id;
    });

    it('should not create a sport with duplicate name', async () => {
      const createSportDto: CreateSportDto = {
        name: 'Integration Test Sport',
        description: 'This should fail due to duplicate name',
      };

      await request(app.getHttpServer())
        .post('/api/sports')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(createSportDto)
        .expect(409);
    });

    it('should not create a sport with invalid data', async () => {
      const invalidSportDto = {
        name: '',
        description: '',
        invalidField: 'should not be here',
      };

      await request(app.getHttpServer())
        .post('/api/sports')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(invalidSportDto)
        .expect(400);
    });
  });

  describe('GET /api/sports', () => {
    it('should return an array of sports', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/sports')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      const sports = response.body as Sport[];
      expect(Array.isArray(sports)).toBe(true);
      expect(sports.length).toBeGreaterThan(0);
      expect(sports[0]).toHaveProperty('id');
      expect(sports[0]).toHaveProperty('name');
      expect(sports[0]).toHaveProperty('description');
    });
  });

  describe('GET /api/sports/:id', () => {
    it('should return a sport by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/sports/${createdSportId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      const sport = response.body as Sport;
      expect(sport).toMatchObject({
        id: createdSportId,
        name: 'Integration Test Sport',
        description: 'A sport created during integration testing',
      });
    });

    it('should return 404 for non-existent sport', async () => {
      await request(app.getHttpServer())
        .get('/api/sports/999999')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });
  });

  describe('PATCH /api/sports/:id', () => {
    it('should update a sport', async () => {
      const updateSportDto: UpdateSportDto = {
        name: 'Updated Integration Test Sport',
        description: 'Updated during integration testing',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/sports/${createdSportId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updateSportDto)
        .expect(200);

      const updatedSport = response.body as Sport;
      expect(updatedSport).toMatchObject({
        id: createdSportId,
        ...updateSportDto,
      });
    });

    it('should return 404 for updating non-existent sport', async () => {
      const updateSportDto: UpdateSportDto = {
        name: 'This Should Fail',
      };

      await request(app.getHttpServer())
        .patch('/api/sports/999999')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updateSportDto)
        .expect(404);
    });

    it('should not update a sport with invalid data', async () => {
      const invalidUpdateDto = {
        name: '',
        invalidField: 'should not be here',
      };

      await request(app.getHttpServer())
        .patch(`/api/sports/${createdSportId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(invalidUpdateDto)
        .expect(400);
    });
  });

  describe('DELETE /api/sports/:id', () => {
    it('should delete a sport', async () => {
      await request(app.getHttpServer())
        .delete(`/api/sports/${createdSportId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      // Verify the sport was actually deleted
      await request(app.getHttpServer())
        .get(`/api/sports/${createdSportId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });

    it('should return 404 for deleting non-existent sport', async () => {
      await request(app.getHttpServer())
        .delete('/api/sports/999999')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });
  });
});

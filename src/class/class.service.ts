import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SportsClass } from './entities/sports-class.entity';
import { ClassRegistration } from './entities/class-registration.entity';
import { Schedule } from './entities/schedule.entity';
import { UserService } from '../user/user.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { SportsService } from '../sports/sports.service';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(SportsClass)
    private readonly classRepository: Repository<SportsClass>,
    @InjectRepository(ClassRegistration)
    private registrationRepository: Repository<ClassRegistration>,
    private userService: UserService,
    private sportsService: SportsService,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async create(createClassDto: CreateClassDto): Promise<SportsClass> {
    await this.sportsService.findOne(createClassDto.sportId);

    const queryRunner =
      this.classRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { schedules, ...classData } = createClassDto;
      const newClass = this.classRepository.create(classData);
      const savedClass = await queryRunner.manager.save(SportsClass, newClass);

      if (schedules && schedules.length) {
        const newSchedules = schedules.map((schedule) => ({
          ...schedule,
          sportsClass: { id: savedClass.id },
        }));
        await queryRunner.manager.save(Schedule, newSchedules);
      }

      await queryRunner.commitTransaction();
      return this.findOne(savedClass.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(sportNames?: string[]): Promise<SportsClass[]> {
    const query = this.classRepository
      .createQueryBuilder('class')
      .leftJoinAndSelect('class.sport', 'sport')
      .leftJoinAndSelect('class.schedules', 'schedules');

    if (sportNames && sportNames.length) {
      const likeConditions = sportNames.map((name, index) => {
        return `sport.name LIKE :name${index}`;
      });

      query.where(likeConditions.join(' OR '));

      sportNames.forEach((name, index) => {
        query.setParameter(`name${index}`, `%${name}%`);
      });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<SportsClass> {
    const sportsClass = await this.classRepository.findOne({
      where: { id },
      relations: ['sport', 'schedules'],
    });
    if (!sportsClass) {
      throw new NotFoundException('Class not found');
    }
    return sportsClass;
  }

  async update(
    id: number,
    updateClassDto: UpdateClassDto,
  ): Promise<SportsClass> {
    const sportsClass = await this.findOne(id);

    const { schedules, sportId, ...updateData } = updateClassDto;

    if (sportId) {
      await this.sportsService.findOne(sportId);
    }

    const queryRunner =
      this.classRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(SportsClass, id, {
        ...updateData,
        sportId,
      });

      if (schedules && schedules.length) {
        await queryRunner.manager.delete(Schedule, { sportsClass: { id } });

        const newSchedules = schedules.map((schedule) => ({
          ...schedule,
          sportsClass: { id },
        }));
        await queryRunner.manager.save(Schedule, newSchedules);
      }

      await queryRunner.commitTransaction();

      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<void> {
    const sportsClass = await this.findOne(id);

    const registrationsCount = await this.registrationRepository.count({
      where: { sportsClass: { id } },
    });

    if (registrationsCount > 0) {
      throw new BadRequestException(
        'Cannot delete the class because it has registered participants. The registrations must be deleted first.',
      );
    }

    await this.classRepository.remove(sportsClass);
  }

  async registerForClass(
    userId: number,
    classId: number,
  ): Promise<ClassRegistration> {
    const user = await this.userService.findOne(userId);
    const sportsClass = await this.findOne(classId);

    const queryRunner =
      this.classRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingRegistration = await queryRunner.manager.findOne(
        ClassRegistration,
        {
          where: {
            user: { id: userId },
            sportsClass: { id: classId },
          },
        },
      );

      if (existingRegistration) {
        throw new BadRequestException(
          'User is already registered for this class',
        );
      }

      const currentRegistrations = await queryRunner.manager.count(
        ClassRegistration,
        {
          where: {
            sportsClass: { id: classId },
          },
        },
      );

      if (currentRegistrations >= sportsClass.maxParticipants) {
        throw new BadRequestException('Class is full');
      }

      const registration = queryRunner.manager.create(ClassRegistration, {
        user,
        sportsClass,
      });

      const savedRegistration = await queryRunner.manager.save(
        ClassRegistration,
        registration,
      );

      await queryRunner.commitTransaction();
      return savedRegistration;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getClassRegistrations(classId: number): Promise<ClassRegistration[]> {
    return this.registrationRepository.find({
      where: { sportsClass: { id: classId } },
      relations: ['user'],
    });
  }

  async unregisterFromClass(userId: number, classId: number): Promise<void> {
    const registration = await this.registrationRepository.findOne({
      where: {
        user: { id: userId },
        sportsClass: { id: classId },
      },
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    await this.registrationRepository.remove(registration);
  }
}

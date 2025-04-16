import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sport } from './entities/sports.entity';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { SportsClass } from '../class/entities/sports-class.entity';

@Injectable()
export class SportsService {
  constructor(
    @InjectRepository(Sport)
    private sportsRepository: Repository<Sport>,
    @InjectRepository(SportsClass)
    private sportsClassRepository: Repository<SportsClass>,
  ) {}

  async create(sportData: CreateSportDto): Promise<Sport> {
    const existingSport = await this.sportsRepository.findOne({
      where: { name: sportData.name },
    });

    if (existingSport) {
      throw new ConflictException(
        `Sport with name ${sportData.name} already exists`,
      );
    }

    const sport = this.sportsRepository.create(sportData);
    return this.sportsRepository.save(sport);
  }

  async findAll(): Promise<Sport[]> {
    return this.sportsRepository.find();
  }

  async findOne(id: number): Promise<Sport> {
    const sport = await this.sportsRepository.findOne({ where: { id } });
    if (!sport) {
      throw new NotFoundException('Sport not found');
    }
    return sport;
  }

  async update(id: number, sportData: UpdateSportDto): Promise<Sport> {
    const sport = await this.findOne(id);

    if (sportData.name && sportData.name !== sport.name) {
      const existingSport = await this.sportsRepository.findOne({
        where: { name: sportData.name },
      });

      if (existingSport) {
        throw new ConflictException(
          `Sport with name ${sportData.name} already exists`,
        );
      }
    }

    Object.assign(sport, sportData);
    return this.sportsRepository.save(sport);
  }

  async remove(id: number): Promise<void> {
    const sport = await this.findOne(id);

    const relatedClasses = await this.sportsClassRepository.find({
      where: { sport: { id } },
    });

    if (relatedClasses.length) {
      throw new ConflictException(
        'Cannot delete sport because it has associated classes. Please delete the classes first.',
      );
    }

    await this.sportsRepository.remove(sport);
  }
}

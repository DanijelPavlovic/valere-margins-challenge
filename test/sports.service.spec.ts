import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { SportsService } from '../src/sports/sports.service';
import { Sport } from '../src/sports/entities/sports.entity';
import { CreateSportDto } from '../src/sports/dto/create-sport.dto';
import { UpdateSportDto } from '../src/sports/dto/update-sport.dto';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { SportsClass } from '../src/class/entities/sports-class.entity';

// Mock entities
jest.mock('../src/user/entities/user.entity', () => ({
  User: jest.fn().mockImplementation(() => ({
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'USER',
  })),
}));

jest.mock('../src/class/entities/class-registration.entity', () => ({
  ClassRegistration: jest.fn().mockImplementation(() => ({
    id: 1,
    user: { id: 1 },
    sportsClass: { id: 1 },
  })),
}));

jest.mock('../src/class/entities/sports-class.entity', () => ({
  SportsClass: jest.fn().mockImplementation(() => ({
    id: 1,
    name: 'Test Class',
    sport: { id: 1 },
  })),
}));

describe('SportsService', () => {
  let service: SportsService;
  let mockRepository: jest.Mocked<
    Pick<Repository<Sport>, 'create' | 'save' | 'find' | 'findOne' | 'remove'>
  >;

  const mockSport: Sport = {
    id: 1,
    name: 'Test Sport',
    description: 'Test Description',
    classes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async function (this: void) {
    mockRepository = {
      create: jest.fn().mockReturnValue(mockSport),
      save: jest.fn().mockResolvedValue(mockSport),
      find: jest.fn().mockResolvedValue([mockSport]),
      findOne: jest
        .fn()
        .mockImplementation((options?: FindOneOptions<Sport>) => {
          const whereOptions = options?.where as { id?: number; name?: string };
          if (whereOptions?.id === 999) {
            return Promise.resolve(null);
          }
          if (whereOptions?.id === 1) {
            return Promise.resolve(mockSport);
          }
          if (whereOptions?.name === 'Test Sport') {
            return Promise.resolve({ ...mockSport, id: 2 });
          }
          if (whereOptions?.name === 'Updated Football') {
            const existingSport = {
              ...mockSport,
              id: 2,
              name: 'Updated Football',
            };
            return Promise.resolve(null);
          }
          return Promise.resolve(null);
        }),
      remove: jest.fn().mockImplementation((sport: Sport) => {
        return Promise.resolve(sport);
      }),
    } as jest.Mocked<
      Pick<Repository<Sport>, 'create' | 'save' | 'find' | 'findOne' | 'remove'>
    >;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SportsService,
        {
          provide: getRepositoryToken(Sport),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(SportsClass),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<SportsService>(SportsService);
  });

  it('should be defined', function (this: void) {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a sport', async function (this: void) {
      const createSportDto: CreateSportDto = {
        name: 'Football',
        description: 'A popular team sport',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockSport);
      mockRepository.save.mockResolvedValue(mockSport);

      const result = await service.create(createSportDto);
      expect(result).toEqual(mockSport);
    });

    it('should throw ConflictException if sport already exists', async function (this: void) {
      const createSportDto: CreateSportDto = {
        name: 'Football',
        description: 'A popular team sport',
      };

      mockRepository.findOne.mockResolvedValue(mockSport);

      await expect(service.create(createSportDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should find all sports', async function (this: void) {
      mockRepository.find.mockResolvedValue([mockSport]);

      const result = await service.findAll();
      expect(result).toEqual([mockSport]);
    });
  });

  describe('findOne', () => {
    it('should find one sport by id', async function (this: void) {
      mockRepository.findOne.mockResolvedValue(mockSport);

      const result = await service.findOne(1);
      expect(result).toEqual(mockSport);
    });

    it('should throw NotFoundException if sport not found', async function (this: void) {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a sport', async function (this: void) {
      const updateSportDto: UpdateSportDto = {
        name: 'Updated Football',
        description: 'Updated description',
      };

      const updatedSport = { ...mockSport, ...updateSportDto };

      // First findOne call (by id) should return the existing sport
      mockRepository.findOne
        .mockResolvedValueOnce(mockSport)
        // Second findOne call (by name) should return null to indicate no conflict
        .mockResolvedValueOnce(null);

      mockRepository.save.mockResolvedValue(updatedSport);

      const result = await service.update(1, updateSportDto);
      expect(result).toEqual(updatedSport);
    });

    it('should throw NotFoundException if sport not found', async function (this: void) {
      const updateSportDto: UpdateSportDto = {
        name: 'Updated Football',
        description: 'Updated description',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, updateSportDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a sport', async function (this: void) {
      mockRepository.findOne.mockResolvedValue(mockSport);
      mockRepository.remove.mockResolvedValue(mockSport);

      const result = await service.remove(1);
      expect(result).toEqual(mockSport);
    });

    it('should throw NotFoundException if sport not found', async function (this: void) {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if sport has associated classes', async function (this: void) {
      mockRepository.findOne.mockResolvedValue(mockSport);
      const mockSportsClassRepository = {
        find: jest.fn().mockResolvedValue([{ id: 1, name: 'Test Class' }]),
      };
      (
        service as unknown as {
          sportsClassRepository: typeof mockSportsClassRepository;
        }
      ).sportsClassRepository = mockSportsClassRepository;

      await expect(service.remove(1)).rejects.toThrow(ConflictException);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { SportsController } from '../src/sports/sports.controller';
import { SportsService } from '../src/sports/sports.service';
import { CreateSportDto } from '../src/sports/dto/create-sport.dto';
import { UpdateSportDto } from '../src/sports/dto/update-sport.dto';
import { Sport } from '../src/sports/entities/sports.entity';

// Mock the dependent entities to avoid circular dependencies
jest.mock('../src/user/entities/user.entity', () => {
  return {
    User: jest.fn().mockImplementation(() => ({
      id: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
    })),
  };
});

jest.mock('../src/class/entities/class-registration.entity', () => {
  return {
    ClassRegistration: jest.fn().mockImplementation(() => ({
      id: 1,
      user: { id: 1 },
      sportsClass: { id: 1 },
    })),
  };
});

jest.mock('../src/class/entities/sports-class.entity', () => {
  return {
    SportsClass: jest.fn().mockImplementation(() => ({
      id: 1,
      name: 'Test Class',
      sport: { id: 1 },
    })),
  };
});

describe('SportsController', () => {
  let controller: SportsController;

  const mockSport = {
    id: 1,
    name: 'Football',
    description: 'A popular team sport',
  };

  const mockSports = [
    mockSport,
    {
      id: 2,
      name: 'Basketball',
      description: 'A team sport played with a ball',
    },
  ];

  const mockSportsService = {
    create: jest.fn().mockResolvedValue(mockSport),
    findAll: jest.fn().mockResolvedValue(mockSports),
    findOne: jest.fn().mockResolvedValue(mockSport),
    update: jest
      .fn()
      .mockResolvedValue({ ...mockSport, name: 'Updated Football' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SportsController],
      providers: [
        {
          provide: SportsService,
          useValue: mockSportsService,
        },
      ],
    }).compile();

    controller = module.get<SportsController>(SportsController);
  });

  it('should be defined', function (this: void) {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new sport', async function (this: void) {
      const createSportDto: CreateSportDto = {
        name: 'Football',
        description: 'A popular team sport',
      };

      const result = await controller.create(createSportDto);
      expect(result).toEqual(mockSport);
      expect(mockSportsService.create).toHaveBeenCalledWith(createSportDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of sports', async function (this: void) {
      const result = await controller.findAll();
      expect(result).toEqual(mockSports);
      expect(mockSportsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a sport by id', async function (this: void) {
      const result = await controller.findOne(1);
      expect(result).toEqual(mockSport);
      expect(mockSportsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a sport', async function (this: void) {
      const updateSportDto: UpdateSportDto = {
        name: 'Updated Football',
        description: 'Updated description',
      };

      const result = await controller.update(1, updateSportDto);
      expect(result).toEqual({ ...mockSport, name: 'Updated Football' });
      expect(mockSportsService.update).toHaveBeenCalledWith(1, updateSportDto);
    });
  });

  describe('remove', () => {
    it('should remove a sport', async function (this: void) {
      await controller.remove(1);
      expect(mockSportsService.remove).toHaveBeenCalledWith(1);
    });
  });
});

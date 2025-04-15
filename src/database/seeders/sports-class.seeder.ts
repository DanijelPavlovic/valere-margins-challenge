import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { SportsClass } from '../../class/entities/sports-class.entity';
import { Schedule } from '../../class/entities/schedule.entity';
import { ClassRegistration } from '../../class/entities/class-registration.entity';
import { User } from '../../user/entities/user.entity';
import { Sport } from '../../sports/entities/sports.entity';

export class SportsClassSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const sportsClassRepository = dataSource.getRepository(SportsClass);
    const scheduleRepository = dataSource.getRepository(Schedule);
    const registrationRepository = dataSource.getRepository(ClassRegistration);
    const userRepository = dataSource.getRepository(User);
    const sportRepository = dataSource.getRepository(Sport);

    // Get existing users and sports
    const users = await userRepository.find();
    const sports = await sportRepository.find();

    if (!users.length || !sports.length) {
      console.log('No users or sports found. Skipping sports class seeder.');
      return;
    }

    const classes = [
      {
        name: 'Yoga Basics',
        description: 'Perfect for beginners to learn the fundamentals of yoga',
        duration: 60,
        maxParticipants: 20,
        isActive: true,
        sport: sports.find((s) => s.name === 'Yoga'),
        schedules: [
          {
            startDate: new Date('2024-03-18'),
          },
          {
            startDate: new Date('2024-03-20'),
          },
        ],
        registrations: users.slice(0, 5).map((user) => ({
          user,
        })),
      },
      {
        name: 'Advanced Tennis',
        description: 'For experienced players looking to improve their game',
        duration: 90,
        maxParticipants: 8,
        isActive: true,
        sport: sports.find((s) => s.name === 'Tennis'),
        schedules: [
          {
            startDate: new Date('2024-03-19'),
          },
          {
            startDate: new Date('2024-03-21'),
          },
        ],
        registrations: users.slice(5, 10).map((user) => ({
          user,
        })),
      },
      {
        name: 'Swimming for Kids',
        description: 'Fun and safe swimming lessons for children',
        duration: 60,
        maxParticipants: 12,
        isActive: true,
        sport: sports.find((s) => s.name === 'Swimming'),
        schedules: [
          {
            startDate: new Date('2024-03-17'),
          },
          {
            startDate: new Date('2024-03-23'),
          },
        ],
        registrations: users.slice(10, 15).map((user) => ({
          user,
        })),
      },
    ];

    for (const classData of classes) {
      const newClass = sportsClassRepository.create({
        name: classData.name,
        description: classData.description,
        duration: classData.duration,
        maxParticipants: classData.maxParticipants,
        isActive: classData.isActive,
        sport: classData.sport,
      });

      const savedClass = await sportsClassRepository.save(newClass);

      for (const scheduleData of classData.schedules) {
        const schedule = scheduleRepository.create({
          startDate: scheduleData.startDate,
          sportsClass: savedClass,
        });
        await scheduleRepository.save(schedule);
      }

      for (const registrationData of classData.registrations) {
        const registration = registrationRepository.create({
          user: registrationData.user,
          sportsClass: savedClass,
        });
        await registrationRepository.save(registration);
      }
    }

    console.log('Sports class seeder completed successfully');
  }
}

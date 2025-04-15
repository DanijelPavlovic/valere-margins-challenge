import { DataSource } from 'typeorm';
import { UserSeeder } from './user.seeder';
import { SportSeeder } from './sport.seeder';
import { SportsClassSeeder } from './sports-class.seeder';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export const seedDatabase = async (dataSource: DataSource): Promise<void> => {
  try {
    console.log('Running seeders...');

    const seeders: Seeder[] = [
      new UserSeeder(),
      new SportSeeder(),
      new SportsClassSeeder(),
    ];
    for (const seeder of seeders) {
      await seeder.run(dataSource, new SeederFactoryManager());
    }

    console.log('All seeders completed successfully');
  } catch (error) {
    console.error('Error running seeders:', error);
    throw error;
  }
};

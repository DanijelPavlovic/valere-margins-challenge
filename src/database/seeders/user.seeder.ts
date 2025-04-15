import { User } from '../../user/entities/user.entity';
import { UserRole } from '../../user/enums/user-role.enum';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import * as bcrypt from 'bcryptjs';

export class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    try {
      const userRepository = dataSource.getRepository(User);

      const users = [
        {
          email: 'admin@example.com',
          password: await bcrypt.hash('admin1234', 10),
          firstName: 'Admin',
          lastName: 'User',
          role: UserRole.ADMIN,
        },
        {
          email: 'user@example.com',
          password: await bcrypt.hash('user1234', 10),
          firstName: 'Regular',
          lastName: 'User',
          role: UserRole.USER,
        },
      ];

      await userRepository.save(users);
      console.log('Users seeded successfully');
    } catch (error) {
      console.error('Error seeding users:', error);
      throw error;
    }
  }
}

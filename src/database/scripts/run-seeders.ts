import { DataSource } from 'typeorm';

import databaseConfig from '../../configs/database.config';
import { config } from 'dotenv';
import { seedDatabase } from '../seeders';

config();

async function bootstrap() {
  const config = databaseConfig();

  const dataSource = new DataSource({
    type: 'mysql',
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    entities: config.entities,
    synchronize: config.synchronize,
    logging: config.logging,
    migrations: config.migrations,
    migrationsTableName: config.migrationsTableName,
  });

  try {
    await dataSource.initialize();
    await seedDatabase(dataSource);
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await dataSource.destroy();
  }
}

bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
  process.exit(1);
});

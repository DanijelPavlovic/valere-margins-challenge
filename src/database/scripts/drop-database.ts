import { config } from 'dotenv';
import * as mysql from 'mysql2/promise';
import databaseConfig from '../../configs/database.config';

config();

async function dropDatabase() {
  const config = databaseConfig();

  const databaseName = config.database;

  if (!databaseName) {
    throw new Error('Database name not found in environment variables');
  }

  const connection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
  });

  try {
    console.log(`Dropping database ${databaseName}...`);
    await connection.query(`DROP DATABASE IF EXISTS \`${databaseName}\``);
    console.log(`Creating database ${databaseName}...`);
    await connection.query(`CREATE DATABASE \`${databaseName}\``);
    console.log('Database reset successfully');
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

dropDatabase().catch(console.error);

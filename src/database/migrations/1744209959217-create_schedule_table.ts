import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateScheduleTable1744209959217 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, check if the sports_class table exists
    const hasSportsClassTable = await queryRunner.hasTable('sports_class');
    if (!hasSportsClassTable) {
      throw new Error(
        'Sports class table must exist before creating schedule table',
      );
    }

    await queryRunner.createTable(
      new Table({
        name: 'schedule',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'startDate',
            type: 'date',
          },
          {
            name: 'sportsClassId',
            type: 'int',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['sportsClassId'],
            referencedTableName: 'sports_class',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('schedule');
  }
}

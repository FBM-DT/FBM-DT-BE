import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEndDateAndStartDateToUserEntity1689695653306
  implements MigrationInterface
{
  name = 'AddEndDateAndStartDateToUserEntity1689695653306';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "startDate" date NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD "endDate" date`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "endDate"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "startDate"`);
  }
}

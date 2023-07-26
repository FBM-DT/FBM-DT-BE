import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEndDateAndStartDateToUserEntity1689695653306
  implements MigrationInterface
{
  name = 'AddEndDateAndStartDateToUserEntity1689695653306';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "task_note" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "context" character varying NOT NULL, CONSTRAINT "PK_fff317f9c71735ddd36da4cd24c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "startDate" date NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD "endDate" date`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "endDate"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "startDate"`);
  }
}

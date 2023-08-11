import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRoleTableMigration1691410254219
  implements MigrationInterface
{
  name = 'UpdateRoleTableMigration1691410254219';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role" ADD "roleId" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "UQ_703705ba862c2bb45250962c9e1" UNIQUE ("roleId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("roleId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "UQ_703705ba862c2bb45250962c9e1"`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "roleId"`);
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
  }
}

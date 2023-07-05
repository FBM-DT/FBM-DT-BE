import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDisableUniqueRoleIdAccountTableMigration1687795242823
  implements MigrationInterface
{
  name = 'UpdateDisableUniqueRoleIdAccountTableMigration1687795242823';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_77bf26eef8865441fb9bd53a364"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "REL_77bf26eef8865441fb9bd53a36"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_77bf26eef8865441fb9bd53a364" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_77bf26eef8865441fb9bd53a364"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "REL_77bf26eef8865441fb9bd53a36" UNIQUE ("roleId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_77bf26eef8865441fb9bd53a364" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}

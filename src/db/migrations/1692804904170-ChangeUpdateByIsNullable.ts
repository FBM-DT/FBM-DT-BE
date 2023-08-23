import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUpdateByIsNullable1692804904170
  implements MigrationInterface
{
  name = 'ChangeUpdateByIsNullable1692804904170';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "updateBy" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD CONSTRAINT "FK_4814076c6c53c0a7d8a36161ff8" FOREIGN KEY ("updateBy") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inventory" ALTER COLUMN "updateBy" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD CONSTRAINT "FK_4814076c6c53c0a7d8a36161ff8" FOREIGN KEY ("updateBy") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelationToInventoryAndAccount1692781228857
  implements MigrationInterface
{
  name = 'AddRelationToInventoryAndAccount1692781228857';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD CONSTRAINT "FK_4814076c6c53c0a7d8a36161ff8" FOREIGN KEY ("updateBy") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inventory" DROP CONSTRAINT "FK_4814076c6c53c0a7d8a36161ff8"`,
    );
  }
}

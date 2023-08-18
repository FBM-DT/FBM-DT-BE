import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnDeleteSetNullFieldPositionAtUserTable1692370044096
  implements MigrationInterface
{
  name = 'UpdateOnDeleteSetNullFieldPositionAtUserTable1692370044096';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_93af21ecba4fa43c4c63d2456cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "positionId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_93af21ecba4fa43c4c63d2456cd" FOREIGN KEY ("positionId") REFERENCES "position"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_93af21ecba4fa43c4c63d2456cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "positionId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_93af21ecba4fa43c4c63d2456cd" FOREIGN KEY ("positionId") REFERENCES "position"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldIsValidOtpAccountTableMigration1691085398802
  implements MigrationInterface
{
  name = 'AddFieldIsValidOtpAccountTableMigration1691085398802';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" ADD "isValidOtp" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "isValidOtp"`);
  }
}

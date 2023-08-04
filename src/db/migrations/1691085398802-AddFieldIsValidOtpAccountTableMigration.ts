import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldIsValidOtpAccountTableMigration1691085398802 implements MigrationInterface {
    name = 'AddFieldIsValidOtpAccountTableMigration1691085398802'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task_note" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "context" character varying NOT NULL, CONSTRAINT "PK_fff317f9c71735ddd36da4cd24c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "account" ADD "isValidOtp" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "isValidOtp"`);
        await queryRunner.query(`DROP TABLE "task_note"`);
    }

}

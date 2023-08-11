import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTableMigration1691320948468 implements MigrationInterface {
    name = 'UpdateUserTableMigration1691320948468'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "user" ADD "citizenId" character varying(12) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "socialInsurance" character varying(15)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "socialInsurance"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "citizenId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isActive"`);
    }

}

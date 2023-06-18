import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRoleEnumMigration1686817613016 implements MigrationInterface {
    name = 'CreateRoleEnumMigration1686817613016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "UQ_ae4578dcaed5adff96595e61660"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "name"`);
        await queryRunner.query(`CREATE TYPE "public"."role_name_enum" AS ENUM('admin', 'supervisor', 'user')`);
        await queryRunner.query(`ALTER TABLE "role" ADD "name" "public"."role_name_enum" NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "UQ_ae4578dcaed5adff96595e61660"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "name"`);
        await queryRunner.query(`DROP TYPE "public"."role_name_enum"`);
        await queryRunner.query(`ALTER TABLE "role" ADD "name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name")`);
    }

}

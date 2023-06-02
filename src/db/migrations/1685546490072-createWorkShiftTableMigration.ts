import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWorkShiftTableMigration1685546490072 implements MigrationInterface {
    name = 'CreateWorkShiftTableMigration1685546490072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."work_shift_type_enum" AS ENUM('daily', 'week')`);
        await queryRunner.query(`CREATE TABLE "work_shift" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(1000) NOT NULL, "type" "public"."work_shift_type_enum" NOT NULL DEFAULT 'daily', "address" character varying(1000) NOT NULL, "duration" character varying(1000) NOT NULL, "description" character varying(1000), CONSTRAINT "PK_22e0debc54582e07d19c6dec325" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "work_shift"`);
        await queryRunner.query(`DROP TYPE "public"."work_shift_type_enum"`);
    }

}

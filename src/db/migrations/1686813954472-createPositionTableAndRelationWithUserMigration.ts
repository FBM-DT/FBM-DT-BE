import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePositionTableAndRelationWithUserMigration1686813954472 implements MigrationInterface {
    name = 'CreatePositionTableAndRelationWithUserMigration1686813954472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "position" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(5000) NOT NULL, "userId" integer NOT NULL, CONSTRAINT "UQ_94b556b24267b2d75d6d05fcd18" UNIQUE ("name"), CONSTRAINT "PK_b7f483581562b4dc62ae1a5b7e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."work_shift_type_enum" RENAME TO "work_shift_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."work_shift_type_enum" AS ENUM('daily', 'week')`);
        await queryRunner.query(`ALTER TABLE "work_shift" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "work_shift" ALTER COLUMN "type" TYPE "public"."work_shift_type_enum" USING "type"::"text"::"public"."work_shift_type_enum"`);
        await queryRunner.query(`ALTER TABLE "work_shift" ALTER COLUMN "type" SET DEFAULT 'daily'`);
        await queryRunner.query(`DROP TYPE "public"."work_shift_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "position" ADD CONSTRAINT "FK_039f90c019013ef5d8d032f32f1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "position" DROP CONSTRAINT "FK_039f90c019013ef5d8d032f32f1"`);
        await queryRunner.query(`CREATE TYPE "public"."work_shift_type_enum_old" AS ENUM('daily', 'week', 'event')`);
        await queryRunner.query(`ALTER TABLE "work_shift" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "work_shift" ALTER COLUMN "type" TYPE "public"."work_shift_type_enum_old" USING "type"::"text"::"public"."work_shift_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "work_shift" ALTER COLUMN "type" SET DEFAULT 'daily'`);
        await queryRunner.query(`DROP TYPE "public"."work_shift_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."work_shift_type_enum_old" RENAME TO "work_shift_type_enum"`);
        await queryRunner.query(`DROP TABLE "position"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEnumTypeMigration1686815712228 implements MigrationInterface {
    name = 'UpdateEnumTypeMigration1686815712228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "work_shift" SET "type" = 'daily' WHERE type = 'week'`);
        await queryRunner.query(`ALTER TYPE "public"."work_shift_type_enum" RENAME TO "work_shift_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."work_shift_type_enum" AS ENUM('daily', 'event')`);
        await queryRunner.query(`ALTER TABLE "work_shift" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "work_shift" ALTER COLUMN "type" TYPE "public"."work_shift_type_enum" USING "type"::"text"::"public"."work_shift_type_enum"`);
        await queryRunner.query(`ALTER TABLE "work_shift" ALTER COLUMN "type" SET DEFAULT 'daily'`);
        await queryRunner.query(`DROP TYPE "public"."work_shift_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."work_shift_type_enum_old" AS ENUM('daily', 'week')`);
        await queryRunner.query(`ALTER TABLE "work_shift" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "work_shift" ALTER COLUMN "type" TYPE "public"."work_shift_type_enum_old" USING "type"::"text"::"public"."work_shift_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "work_shift" ALTER COLUMN "type" SET DEFAULT 'daily'`);
        await queryRunner.query(`DROP TYPE "public"."work_shift_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."work_shift_type_enum_old" RENAME TO "work_shift_type_enum"`);
    }

}

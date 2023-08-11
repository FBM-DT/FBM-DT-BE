import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTaskAndNoteTableMigration1691416149616 implements MigrationInterface {
    name = 'UpdateTaskAndNoteTableMigration1691416149616'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "note" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "context" character varying(500) NOT NULL, "createdBy" integer NOT NULL, "shiftId" integer NOT NULL, CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."task_status_enum" AS ENUM('todo', 'inprogress', 'done')`);
        await queryRunner.query(`ALTER TABLE "task" ADD "status" "public"."task_status_enum" NOT NULL DEFAULT 'todo'`);
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "FK_685fc702abcc4283e60949b01cc" FOREIGN KEY ("createdBy") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "FK_8d10911b6f6fe42ceb6dc5cd234" FOREIGN KEY ("shiftId") REFERENCES "shift"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_8d10911b6f6fe42ceb6dc5cd234"`);
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_685fc702abcc4283e60949b01cc"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "status" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "name" character varying(1000) NOT NULL`);
        await queryRunner.query(`DROP TABLE "note"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTaskNoteTableMigration1691153951492 implements MigrationInterface {
    name = 'CreateTaskNoteTableMigration1691153951492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task_note" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "context" character varying(500) NOT NULL, "accountId" integer NOT NULL, "taskId" integer NOT NULL, CONSTRAINT "PK_fff317f9c71735ddd36da4cd24c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "account" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "task_note" ADD CONSTRAINT "FK_c735900df79107578f3736bb7fa" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_note" ADD CONSTRAINT "FK_bc063e055555168bb172b12f36f" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_note" DROP CONSTRAINT "FK_bc063e055555168bb172b12f36f"`);
        await queryRunner.query(`ALTER TABLE "task_note" DROP CONSTRAINT "FK_c735900df79107578f3736bb7fa"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "isActive"`);
        await queryRunner.query(`DROP TABLE "task_note"`);
    }

}

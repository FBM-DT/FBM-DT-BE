import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRelationBetweenTaskAndTaskNoteAndAccountMigration1689770228150 implements MigrationInterface {
    name = 'CreateRelationBetweenTaskAndTaskNoteAndAccountMigration1689770228150'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_note" ADD "accountId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task_note" ADD "taskId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task_note" DROP COLUMN "context"`);
        await queryRunner.query(`ALTER TABLE "task_note" ADD "context" character varying(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task_note" ADD CONSTRAINT "FK_c735900df79107578f3736bb7fa" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_note" ADD CONSTRAINT "FK_bc063e055555168bb172b12f36f" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_note" DROP CONSTRAINT "FK_bc063e055555168bb172b12f36f"`);
        await queryRunner.query(`ALTER TABLE "task_note" DROP CONSTRAINT "FK_c735900df79107578f3736bb7fa"`);
        await queryRunner.query(`ALTER TABLE "task_note" DROP COLUMN "context"`);
        await queryRunner.query(`ALTER TABLE "task_note" ADD "context" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task_note" DROP COLUMN "taskId"`);
        await queryRunner.query(`ALTER TABLE "task_note" DROP COLUMN "accountId"`);
    }

}

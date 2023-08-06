import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTaskNoteTableMigration1689768828071 implements MigrationInterface {
    name = 'CreateTaskNoteTableMigration1689768828071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task_note" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "context" character varying NOT NULL, CONSTRAINT "PK_fff317f9c71735ddd36da4cd24c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_77bf26eef8865441fb9bd53a364"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "REL_77bf26eef8865441fb9bd53a36"`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_77bf26eef8865441fb9bd53a364" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_77bf26eef8865441fb9bd53a364"`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "REL_77bf26eef8865441fb9bd53a36" UNIQUE ("roleId")`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_77bf26eef8865441fb9bd53a364" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "task_note"`);
    }

}

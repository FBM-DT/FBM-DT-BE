import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTaskTableMigration1685547419453 implements MigrationInterface {
    name = 'CreateTaskTableMigration1685547419453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(1000) NOT NULL, "status" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "task"`);
    }
}

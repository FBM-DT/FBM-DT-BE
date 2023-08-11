import { MigrationInterface, QueryRunner } from "typeorm"

export class DropTableTaskNoteMigration1691416255631 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "task_note"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}

import { MigrationInterface, QueryRunner } from "typeorm"

export class DropTableWorkShiftMigration1691414132262 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "staff_shift"`);
        await queryRunner.query(`DROP TABLE "work_shift"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}

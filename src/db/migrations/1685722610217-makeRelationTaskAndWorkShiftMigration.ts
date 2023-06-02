import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeRelationTaskAndWorkShiftMigration1685722610217 implements MigrationInterface {
    name = 'MakeRelationTaskAndWorkShiftMigration1685722610217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD "workShiftId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_0adf3c7852dec2b477e1638ab37" FOREIGN KEY ("workShiftId") REFERENCES "work_shift"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_0adf3c7852dec2b477e1638ab37"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "workShiftId"`);
    }

}

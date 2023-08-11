import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRelationBetweenScheduleTaskShiftUserTable1691413884850 implements MigrationInterface {
    name = 'UpdateRelationBetweenScheduleTaskShiftUserTable1691413884850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_0adf3c7852dec2b477e1638ab37"`);
        await queryRunner.query(`ALTER TABLE "task" RENAME COLUMN "workShiftId" TO "shiftId"`);
        await queryRunner.query(`CREATE TABLE "shift" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(1000) NOT NULL, "repeatDays" integer array NOT NULL, "departmentId" integer NOT NULL, "startTime" character varying(5) NOT NULL, "endTime" character varying(5) NOT NULL, CONSTRAINT "PK_53071a6485a1e9dc75ec3db54b9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "schedule" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "startDate" date NOT NULL, "shiftId" integer NOT NULL, "userId" integer NOT NULL, "startAt" date, "endTime" date, CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_a5d160c39acb46cd3ab14c81967" FOREIGN KEY ("shiftId") REFERENCES "shift"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shift" ADD CONSTRAINT "FK_02671579fb9a8607d5197baaeec" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_cfe5b74fcde178f5028a3dc03ac" FOREIGN KEY ("shiftId") REFERENCES "shift"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_d796103491cf0bae197dda59477" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_d796103491cf0bae197dda59477"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_cfe5b74fcde178f5028a3dc03ac"`);
        await queryRunner.query(`ALTER TABLE "shift" DROP CONSTRAINT "FK_02671579fb9a8607d5197baaeec"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_a5d160c39acb46cd3ab14c81967"`);
        await queryRunner.query(`DROP TABLE "schedule"`);
        await queryRunner.query(`DROP TABLE "shift"`);
        await queryRunner.query(`ALTER TABLE "task" RENAME COLUMN "shiftId" TO "workShiftId"`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_0adf3c7852dec2b477e1638ab37" FOREIGN KEY ("workShiftId") REFERENCES "work_shift"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}

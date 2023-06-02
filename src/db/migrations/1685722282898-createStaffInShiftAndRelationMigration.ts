import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStaffInShiftAndRelationMigration1685722282898 implements MigrationInterface {
    name = 'CreateStaffInShiftAndRelationMigration1685722282898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "staff_shift" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "workShiftId" integer NOT NULL, "staffId" integer NOT NULL, "startAt" date, "endTime" date, CONSTRAINT "PK_63086650f3158efe47f1af8a148" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "staff_shift" ADD CONSTRAINT "FK_f92e52ee640fe1ec43515b089c6" FOREIGN KEY ("workShiftId") REFERENCES "work_shift"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "staff_shift" ADD CONSTRAINT "FK_7634e240b06d84972ddf0431d2a" FOREIGN KEY ("staffId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff_shift" DROP CONSTRAINT "FK_7634e240b06d84972ddf0431d2a"`);
        await queryRunner.query(`ALTER TABLE "staff_shift" DROP CONSTRAINT "FK_f92e52ee640fe1ec43515b089c6"`);
        await queryRunner.query(`DROP TABLE "staff_shift"`);
    }

}

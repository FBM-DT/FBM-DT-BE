import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateScheduleTableMigration1691414857154 implements MigrationInterface {
    name = 'UpdateScheduleTableMigration1691414857154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_d796103491cf0bae197dda59477"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "startAt"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "endTime"`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD "accountId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD "isAccept" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD "updatedBy" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD "checkIn" character varying(5)`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD "checkOut" character varying(5)`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD "isLate" boolean`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_cdbe1e9e53bf53019a461c63bde" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_cdbe1e9e53bf53019a461c63bde"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "isLate"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "checkOut"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "checkIn"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "isAccept"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "accountId"`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD "endTime" date`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD "startAt" date`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_d796103491cf0bae197dda59477" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}

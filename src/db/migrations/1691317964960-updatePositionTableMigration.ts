import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePositionTableMigration1691317964960 implements MigrationInterface {
    name = 'UpdatePositionTableMigration1691317964960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "position" DROP CONSTRAINT "FK_039f90c019013ef5d8d032f32f1"`);
        await queryRunner.query(`ALTER TABLE "position" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "positionId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "position" DROP CONSTRAINT "UQ_94b556b24267b2d75d6d05fcd18"`);
        await queryRunner.query(`ALTER TABLE "position" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "position" ADD "name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_93af21ecba4fa43c4c63d2456cd" FOREIGN KEY ("positionId") REFERENCES "position"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_93af21ecba4fa43c4c63d2456cd"`);
        await queryRunner.query(`ALTER TABLE "position" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "position" ADD "name" character varying(5000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "position" ADD CONSTRAINT "UQ_94b556b24267b2d75d6d05fcd18" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "positionId"`);
        await queryRunner.query(`ALTER TABLE "account" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "position" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "position" ADD CONSTRAINT "FK_039f90c019013ef5d8d032f32f1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Inventory1689438370020 implements MigrationInterface {
    name = 'Inventory1689438370020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "inventory" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "quantity" integer NOT NULL, "updateBy" integer NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phoneNumber"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "phoneNumber" character varying`);
        await queryRunner.query(`DROP TABLE "inventory"`);
    }

}

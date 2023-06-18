import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccountTableMigration1686817209643 implements MigrationInterface {
    name = 'CreateAccountTableMigration1686817209643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`CREATE TABLE "account" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "phonenumber" character varying(10), "password" character varying(5000) NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "UQ_cf18095b79d00bb4b9062a4a1fb" UNIQUE ("phonenumber"), CONSTRAINT "REL_77bf26eef8865441fb9bd53a36" UNIQUE ("roleId"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_c1756d987198666d8b02af03439"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phonenumber"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roleId"`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_77bf26eef8865441fb9bd53a364" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_77bf26eef8865441fb9bd53a364"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "roleId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phonenumber" character varying(10)`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_c1756d987198666d8b02af03439" UNIQUE ("phonenumber")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying(5000) NOT NULL`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}

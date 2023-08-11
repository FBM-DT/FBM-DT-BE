import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAccountTableMigration1691321468304 implements MigrationInterface {
    name = 'UpdateAccountTableMigration1691321468304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"`);
        await queryRunner.query(`ALTER TABLE "account" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "account" ADD "firstLogin" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "phonenumber" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "account" ADD "password" character varying(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "account" ADD "password" character varying(5000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "phonenumber" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "firstLogin"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE SET NULL`);
    }

}

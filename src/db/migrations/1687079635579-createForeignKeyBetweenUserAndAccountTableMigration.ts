import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateForeignKeyBetweenUserAndAccountTableMigration1687079635579 implements MigrationInterface {
    name = 'CreateForeignKeyBetweenUserAndAccountTableMigration1687079635579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE SET NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "userId"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenFieldIntoAccountTableMigration1687880512071 implements MigrationInterface {
    name = 'AddRefreshTokenFieldIntoAccountTableMigration1687880512071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "refreshToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "refreshToken"`);
    }

}

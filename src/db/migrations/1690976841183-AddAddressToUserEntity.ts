import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAddressToUserEntity1690976841183 implements MigrationInterface {
    name = 'AddAddressToUserEntity1690976841183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying(500)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
    }

}

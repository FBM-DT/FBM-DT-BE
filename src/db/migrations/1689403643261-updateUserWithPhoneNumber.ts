import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserWithPhoneNumber1689403643261 implements MigrationInterface {
    name = 'UpdateUserWithPhoneNumber1689403643261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phoneNumber" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phoneNumber" character varying(10)`);
    }

}

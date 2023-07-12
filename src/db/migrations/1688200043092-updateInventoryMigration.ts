import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateInventoryMigration1688200043092 implements MigrationInterface {
    name = 'UpdateInventoryMigration1688200043092'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "isDeleted"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifiedInventoryMigration1687842120211 implements MigrationInterface {
    name = 'ModifiedInventoryMigration1687842120211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" ALTER COLUMN "updateBy" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" ALTER COLUMN "updateBy" DROP NOT NULL`);
    }

}

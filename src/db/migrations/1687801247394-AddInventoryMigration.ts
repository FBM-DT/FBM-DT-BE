import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInventoryMigration1687801247394 implements MigrationInterface {
    name = 'AddInventoryMigration1687801247394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" ALTER COLUMN "updateBy" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" ALTER COLUMN "updateBy" DROP NOT NULL`);
    }

}

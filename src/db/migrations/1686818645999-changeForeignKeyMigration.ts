import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeForeignKeyMigration1686818645999 implements MigrationInterface {
    name = 'ChangeForeignKeyMigration1686818645999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff_shift" DROP CONSTRAINT "FK_7634e240b06d84972ddf0431d2a"`);
        await queryRunner.query(`ALTER TABLE "staff_shift" RENAME COLUMN "staffId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "staff_shift" ADD CONSTRAINT "FK_82eadecba4c7dbb874965e82647" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff_shift" DROP CONSTRAINT "FK_82eadecba4c7dbb874965e82647"`);
        await queryRunner.query(`ALTER TABLE "staff_shift" RENAME COLUMN "userId" TO "staffId"`);
        await queryRunner.query(`ALTER TABLE "staff_shift" ADD CONSTRAINT "FK_7634e240b06d84972ddf0431d2a" FOREIGN KEY ("staffId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}

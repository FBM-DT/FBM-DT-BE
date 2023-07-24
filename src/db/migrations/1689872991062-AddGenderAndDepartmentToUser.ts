import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGenderAndDepartmentToUser1689872991062 implements MigrationInterface {
    name = 'AddGenderAndDepartmentToUser1689872991062'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_department_enum" AS ENUM('Coffeeshop', 'Bakery', 'Bar', 'Lounge', 'Restaurant', 'Banquet', 'RoomService', 'other')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "department" "public"."user_department_enum" NOT NULL DEFAULT 'Coffeeshop'`);
        await queryRunner.query(`CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female', 'other')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "gender" "public"."user_gender_enum" NOT NULL DEFAULT 'male'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`);
        await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "department"`);
        await queryRunner.query(`DROP TYPE "public"."user_department_enum"`);
    }

}

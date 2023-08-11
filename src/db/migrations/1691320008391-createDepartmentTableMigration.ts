import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDepartmentTableMigration1691320008391 implements MigrationInterface {
    name = 'CreateDepartmentTableMigration1691320008391'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "department" TO "departmentId"`);
        await queryRunner.query(`ALTER TYPE "public"."user_department_enum" RENAME TO "user_departmentid_enum"`);
        await queryRunner.query(`CREATE TABLE "department" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "address" character varying(255) NOT NULL, "openAt" character varying(5) NOT NULL, "closeAt" character varying(5) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "departmentId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "departmentId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_3d6915a33798152a079997cad28" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3d6915a33798152a079997cad28"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "departmentId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "departmentId" "public"."user_departmentid_enum" NOT NULL DEFAULT 'Coffeeshop'`);
        await queryRunner.query(`DROP TABLE "department"`);
        await queryRunner.query(`ALTER TYPE "public"."user_departmentid_enum" RENAME TO "user_department_enum"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "departmentId" TO "department"`);
    }

}

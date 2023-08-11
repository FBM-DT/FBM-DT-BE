import { DEPARTMENT } from 'src/core/constants';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDepartment1691588221408 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "department"("name","address","openAt","closeAt", "isActive") VALUES
            ($1,$2,$3,$4,$5)`,
      [
        DEPARTMENT.BAKERY,
        'Trai dat, He mat troi, Milkyway, Galaxy',
        '05:00',
        '22:00',
        true,
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "department" WHERE "name" IN ($1)', [
      DEPARTMENT.BAKERY,
    ]);
  }
}

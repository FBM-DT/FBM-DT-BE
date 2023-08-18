import { DEPARTMENT } from 'src/core/constants';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedMoreDepartment1692385170853 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "department"("name","address","openAt","closeAt", "isActive") VALUES
              ($1,$2,$3,$4,$5), ($6,$7,$8,$9,$10), ($11,$12,$13,$14,$15), ($16,$17,$18,$19,$20), ($21,$22,$23,$24,$25), ($26,$27,$28,$29,$30), ($31,$32,$33,$34,$35)`,
      [
        DEPARTMENT.BANQUET,
        'Trai dat, He mat troi, Milkyway, Galaxy',
        '05:00',
        '22:00',
        true,
        DEPARTMENT.BAR,
        'Trai dat, He mat troi, Milkyway, Galaxy',
        '05:00',
        '22:00',
        true,
        DEPARTMENT.BAKERY,
        'Trai dat, He mat troi, Milkyway, Galaxy',
        '05:00',
        '22:00',
        true,
        DEPARTMENT.COFFEESHOP,
        'Trai dat, He mat troi, Milkyway, Galaxy',
        '05:00',
        '22:00',
        true,
        DEPARTMENT.LOUNGE,
        'Trai dat, He mat troi, Milkyway, Galaxy',
        '05:00',
        '22:00',
        true,
        DEPARTMENT.RESTAURANT,
        'Trai dat, He mat troi, Milkyway, Galaxy',
        '05:00',
        '22:00',
        true,
        DEPARTMENT.ROOMSERVICE,
        'Trai dat, He mat troi, Milkyway, Galaxy',
        '05:00',
        '22:00',
        true,
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

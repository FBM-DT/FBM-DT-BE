import { ACCOUNT_ROLE } from '../../core/constants';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRole1689561043392 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'INSERT INTO "role"("name") VALUES ($1),($2),($3)',
      [ACCOUNT_ROLE.ADM, ACCOUNT_ROLE.SUPERVISOR, ACCOUNT_ROLE.USER],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "role" WHERE "name" IN ($1,$2,$3)', [
      ACCOUNT_ROLE.ADM,
      ACCOUNT_ROLE.SUPERVISOR,
      ACCOUNT_ROLE.USER,
    ]);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';
import { ACCOUNT_ROLE } from '../../core/constants';

export class SeedNewRoles1691587829782 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'INSERT INTO "role"("name", "roleId") VALUES ($1,$2),($3,$4),($5,$6)',
      [ACCOUNT_ROLE.ADM, 1, ACCOUNT_ROLE.SUPERVISOR, 2, ACCOUNT_ROLE.USER, 3],
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

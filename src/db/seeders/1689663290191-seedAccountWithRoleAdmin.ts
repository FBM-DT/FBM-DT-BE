import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedAccountWithRoleAdmin1689663290191
  implements MigrationInterface
{
  name = 'SeedAccountWithRoleAdmin1689663290191';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'INSERT INTO "account"("phonenumber", "password", "roleId",  "userId") VALUES ($1,$2,$3,$4)',
      [
        '0989689999',
        '$2a$10$erash20TVXC6UVHu8R4ZSuhDy9DU0i6Rdzj1.pKgMOIAx6uMsah8C',
        1,
        1,
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "account"');
  }
}

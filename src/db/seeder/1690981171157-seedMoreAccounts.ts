import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedMoreAccounts1690981171157 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'INSERT INTO "account"("phonenumber", "password", "roleId",  "userId") VALUES ($1,$2,$3,$4),($5,$6,$7,$8),($9,$10,$11,$12),($13,$14,$15,$16),($17,$18,$19,$20)',
      [
        '0326268877',
        '$2a$10$erash20TVXC6UVHu8R4ZSuhDy9DU0i6Rdzj1.pKgMOIAx6uMsah8C',
        1,
        2,
        '0326268878',
        '$2a$10$erash20TVXC6UVHu8R4ZSuhDy9DU0i6Rdzj1.pKgMOIAx6uMsah8C',
        1,
        3,
        '0326268879',
        '$2a$10$erash20TVXC6UVHu8R4ZSuhDy9DU0i6Rdzj1.pKgMOIAx6uMsah8C',
        1,
        4,
        '0326268880',
        '$2a$10$erash20TVXC6UVHu8R4ZSuhDy9DU0i6Rdzj1.pKgMOIAx6uMsah8C',
        1,
        5,
        '0326268881',
        '$2a$10$erash20TVXC6UVHu8R4ZSuhDy9DU0i6Rdzj1.pKgMOIAx6uMsah8C',
        1,
        6,
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "account"');
  }
}

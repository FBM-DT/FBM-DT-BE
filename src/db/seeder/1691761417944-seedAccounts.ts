import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedAccounts1691761417944 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "account"("phonenumber", "password", "roleId",  "userId" , "refreshToken", "isActive", "isValidOtp", "firstLogin") 
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8),
          ($9,$10,$11,$12,$13,$14,$15,$16),
          ($17,$18,$19,$20,$21,$22,$23,$24),
          ($25,$26,$27,$28,$29,$30,$31,$32);`,
      [
        '0326268877',
        '$2a$10$kR0gRIF9WjAsRAV0chVrJOZ.d6fRefLwGMiKXQjX5yOJWylgcwEtK',
        1,
        1,
        null,
        true,
        true,
        true,
        '0326268878',
        '$$2a$10$kR0gRIF9WjAsRAV0chVrJOZ.d6fRefLwGMiKXQjX5yOJWylgcwEtK',
        2,
        2,
        null,
        true,
        true,
        true,
        '0326268879',
        '$2a$10$kR0gRIF9WjAsRAV0chVrJOZ.d6fRefLwGMiKXQjX5yOJWylgcwEtK',
        3,
        3,
        null,
        true,
        true,
        true,
        '0326268880',
        '$2a$10$kR0gRIF9WjAsRAV0chVrJOZ.d6fRefLwGMiKXQjX5yOJWylgcwEtK',
        1,
        4,
        null,
        true,
        true,
        true,
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "account"');
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUsers1689610904619 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'INSERT INTO "user"("fullname", "email", "avatar") VALUES ($1,$2,$3)',
      [
        'Pham Trung Nam',
        'nampt@gmail.com',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE * FROM "user"');
  }
}

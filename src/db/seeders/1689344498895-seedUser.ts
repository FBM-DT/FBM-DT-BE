import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUser1689340266547 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'INSERT INTO "user"("fullname", "email", "avatar") VALUES ($1,$2,$3), ($4,$5,$6), ($7,$8,$9)',
      [
        'Nguyen Hoang Lam',
        'lam@gmail.com',
        'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80',
        'Pham Trung Nam',
        'nampt@gmail.com',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        'Phung Anh Khoa',
        'khoaphung@gmail.com',
        'https://images.unsplash.com/photo-1630841539293-bd20634c5d72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE * FROM "user"');
  }
}

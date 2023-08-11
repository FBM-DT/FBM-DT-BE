import { MigrationInterface, QueryRunner } from "typeorm"

export class SeedPositions1691757374683 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO "position"("name") VALUES ($1),($2),($3),($4),($5);`,
            [
              'Giám đốc',
              'Quản lý',
              'Nhân viên toàn thời gian',
              'Nhân viên bán thời gian',
              'Tạp vụ'
            ],
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM "position"');
    }

}
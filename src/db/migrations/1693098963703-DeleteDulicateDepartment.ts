import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteDulicateDepartment1693098963703
  implements MigrationInterface
{
  name = 'DeleteDulicateDepartment1693098963703';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "department" WHERE "id" = 4');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

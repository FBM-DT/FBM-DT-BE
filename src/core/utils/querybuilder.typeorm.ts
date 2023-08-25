import { DataSource, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { ShareEntity } from '../shared';
export const ExtraQueryBuilder = {
  async paginateData<T extends ShareEntity>(
    dataSource: DataSource,
    subQuery: SelectQueryBuilder<T>,
    page: number,
    pageSize: number,
  ): Promise<ObjectLiteral[]> {
    // subQuery.addSelect('ROW_NUMBER() OVER(ORDER BY "u"."id" asc) AS row');
    const start: number = (page - 1) * pageSize + 1;
    const end: number = start + pageSize;
    // const data = await dataSource.createQueryRunner().query(
    //   `SELECT * FROM(
    //     ${subQuery.getQuery()}
    //   ) "data" WHERE "data"."row" >= $1 AND  "data"."row" < $2`,
    //   [start, end]
    // )
    const data = await subQuery
      // .andWhere('row >= :start', { start: start })
      // .andWhere('row < :end', { end: end })
      .getMany();

    return data;
  },
};

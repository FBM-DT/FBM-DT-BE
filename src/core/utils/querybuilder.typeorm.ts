import { DataSource, SelectQueryBuilder } from 'typeorm';
import { ShareEntity } from '../shared';
export const ExtraQueryBuilder = {
  async paginateData<T extends ShareEntity, Payload>(
    rowNumberBy: { alias: string; field: string },
    dataSource: DataSource,
    subQuery: SelectQueryBuilder<T>,
    page: number,
    pageSize: number,
  ): Promise<Payload[]> {
    subQuery.addSelect(
      `DENSE_RANK() OVER(ORDER BY "${rowNumberBy.alias}"."${rowNumberBy.field}")::integer AS row`,
    );
    const start: number = (page - 1) * pageSize + 1;
    const end: number = start + pageSize;
    const data: Payload[] = await dataSource
      .createQueryBuilder()
      .select('*')
      .from('(' + subQuery.getQuery() + ')', 'data')
      .setParameters(subQuery.getParameters())
      .where('data.row >= :start', { start: start })
      .andWhere('data.row < :end', { end: end })
      .getRawMany();
    return data;
  },
};

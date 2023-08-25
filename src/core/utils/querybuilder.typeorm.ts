import { BaseEntity, Brackets, SelectQueryBuilder } from 'typeorm';
export const ExtraQueryBuilder = {
  async paginateBy<T extends BaseEntity>(
    query: SelectQueryBuilder<T>,
    pagination: { page: number; pageSize: number },
  ): Promise<{ fullQuery: SelectQueryBuilder<T>; pages: number }> {
    let totalPage: number;
    const records: number = await query.getCount();
    if (records <= pagination.pageSize) {
      totalPage = 1;
    } else {
      if (records % pagination.pageSize === 0) {
        totalPage = records / pagination.pageSize;
      } else {
        totalPage = Math.ceil(records / pagination.pageSize);
      }
    }

    const child = query
      .take(pagination.pageSize)
      .skip((pagination.page - 1) * pagination.pageSize);
    return {
      fullQuery: child,
      pages: totalPage,
    };
  },
  addWhereAnd<T extends BaseEntity>(
    query: SelectQueryBuilder<T>,
    mappingFields: Array<string>,
    queries: Object,
    alias: string,
  ): SelectQueryBuilder<T> {
    mappingFields.forEach((field) => {
      const keyAndType: Array<string> = field.split(':');
      if (!queries[keyAndType[0]]) {
        return;
      }
      if (keyAndType[1] !== 'varchar') {
        query = query.andWhere(
          `${alias}.${keyAndType[0]} = :inputValue${keyAndType[1]}And`,
          {
            ['inputValue' + keyAndType[1] + 'And']: queries[keyAndType[0]],
          },
        );
      }
      if (keyAndType[1] === 'varchar') {
        query = query.andWhere(
          `LOWER(CAST(${alias}.${keyAndType[0]}) AS VARCHAR) LIKE LOWER(:inputValue${keyAndType[1]}And)`,
          {
            ['inputValue' + keyAndType[1]+ 'And']:
              '%' + queries[keyAndType[0]].toString() + '%',
          },
        );
      }
    });
    return query;
  },
  addWhereOr<T extends BaseEntity>(
    query: SelectQueryBuilder<T>,
    whereOptions: Array<string>,
    queries: Object,
  ): SelectQueryBuilder<T> {
    if (!(queries['searchText'] && whereOptions) || whereOptions.length === 0) {
      return query;
    }
    query = query.andWhere(
      new Brackets((subquery) => {
        whereOptions.forEach((field, index) => {
          subquery = subquery.orWhere(
            `LOWER(CAST(${field} AS VARCHAR)) LIKE LOWER(:inputValue${index})`,
            {
              ['inputValue' + index]: '%' + queries['searchText'] + '%',
            },
          );
        });
      }),
    );

    return query;
  },
};

import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { PaginationReqDto } from '../shared/request';
import { ShareEntity } from '../shared';

export const TransformTypeormOption = {
  convertPaginationOptions(
    paginationOptions: PaginationReqDto,
    options: FindManyOptions,
  ): void {
    options = {
      ...options,
      skip: (paginationOptions.page - 1) * paginationOptions.pageSize,
      take: paginationOptions.pageSize,
    };
  },

  // convertSearchOptions<T extends ShareEntity>(
  //   searchOptions: Object,
  //   typeormWhereConditions: FindOptionsWhere<T>,
  // ): void {
  //   typeormWhereConditions = {
  //     ...typeormWhereConditions,
  //     order: { [searchOptions['sortBy']]: searchOptions['sortValue'] },
  //   };
  // },
};

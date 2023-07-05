import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { PaginationRequestDto } from '../shared/pagination.request.dto';
import { ShareEntity } from '../shared';

export const FilterConvert = {
  convertPaginationOptions(
    paginationOptions: PaginationRequestDto,
    options: FindManyOptions,
  ): void {
    options = {
      ...options,
      skip: (paginationOptions.page - 1) * paginationOptions.pageSize,
      take: paginationOptions.pageSize,
    };
  },

  convertSearchOptions(
    searchOptions: Object,
    typeormWhereConditions: FindOptionsWhere<ShareEntity>,
  ): void {},
};

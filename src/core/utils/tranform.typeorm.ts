import {
  FindManyOptions,
  FindOptionsWhere,
  FindOptionsOrder,
  Like,
} from 'typeorm';
import { PaginationReqDto } from '../shared/request';
import { ShareEntity } from '../shared';
import { ISort } from '../abstract/interface';
import { SEARCH_TYPE } from '../constants';

export const ExtraQuery = {
  paginateBy(paginationOptions: PaginationReqDto, options: FindManyOptions) {
    if (
      paginationOptions.page !== null &&
      paginationOptions.page !== undefined &&
      paginationOptions.pageSize !== null &&
      paginationOptions.pageSize !== undefined
    ) {
      Object.assign(options, {
        skip: (paginationOptions.page - 1) * paginationOptions.pageSize,
        take: paginationOptions.pageSize,
      });
    }
  },
  sortBy<T extends ShareEntity>(
    sortOptions: Array<ISort>,
    options: FindManyOptions,
  ): void {
    if (sortOptions !== undefined) {
      let ordersOption: FindOptionsOrder<T> = {};
      sortOptions.forEach((option) => {
        if (
          option.sortBy !== null &&
          option.sortBy !== undefined &&
          option.sortValue !== null &&
          option.sortValue !== undefined
        ) {
          ordersOption = {
            ...ordersOption,
            [option.sortBy.toString()]: option.sortValue,
          };
        }
      });
      Object.assign(options, {
        order: ordersOption,
      });
    }
  },
  searchBy<T extends ShareEntity>(
    searchObject: Object,
    options: FindManyOptions,
    searchType: SEARCH_TYPE = SEARCH_TYPE.AND,
  ): void {
    if (Object.keys(searchObject)?.length === 0) {
      return;
    }
    let typeormWhereConditions: FindOptionsWhere<T> = {};
    Object.keys(searchObject).forEach((key: string) => {
      if (searchObject[key] !== undefined && searchObject[key] !== null) {
        Object.assign(typeormWhereConditions, {
          [key]: Like(`%${searchObject[key]}%`),
        });
      }
    });

    if (searchType === SEARCH_TYPE.AND) {
      if (options.where?.length > 0) {
        let newWhereOptions: FindOptionsWhere<T>[] = [];
        options.where?.forEach((existOption) => {
          existOption = {
            ...existOption,
            ...typeormWhereConditions,
          };
          newWhereOptions.push(existOption);
        });
        Object.assign(options, { where: newWhereOptions });
      } else {
        Object.assign(options, { where: [typeormWhereConditions] });
      }
    } else {
      let newWhereOptions: FindOptionsWhere<T>[] = [];
      if (options.where?.length > 0) {
        newWhereOptions.push.apply(newWhereOptions, options.where);
        newWhereOptions.push(typeormWhereConditions);
        Object.assign(options, { where: newWhereOptions });
      } else {
        Object.assign(options, { where: [typeormWhereConditions] });
      }
    }
  },
  searchByEnum<T extends ShareEntity>(
    searchObject: Object,
    options: FindManyOptions,
    searchType: SEARCH_TYPE = SEARCH_TYPE.AND,
  ) {
    if (Object.keys(searchObject)?.length === 0) {
      return;
    }
    let typeormWhereConditions: FindOptionsWhere<T> = {};
    Object.keys(searchObject).forEach((key: string) => {
      if (searchObject[key] !== undefined && searchObject[key] !== null) {
        Object.assign(typeormWhereConditions, {
          [key]: searchObject[key],
        });
      }
    });
    if (searchType === SEARCH_TYPE.AND) {
      if (options.where?.length > 0) {
        let newWhereOptions: FindOptionsWhere<T>[] = [];
        options.where?.forEach((existOption) => {
          existOption = {
            ...existOption,
            ...typeormWhereConditions,
          };
          newWhereOptions.push(existOption);
        });
        Object.assign(options, { where: newWhereOptions });
      } else {
        Object.assign(options, { where: [typeormWhereConditions] });
      }
    } else {
      let newWhereOptions: FindOptionsWhere<T>[] = [];
      if (options.where?.length > 0) {
        newWhereOptions.push.apply(newWhereOptions, options.where);
        newWhereOptions.push(typeormWhereConditions);
        Object.assign(options, { where: newWhereOptions });
      } else {
        Object.assign(options, { where: [typeormWhereConditions] });
      }
    }
  },
};

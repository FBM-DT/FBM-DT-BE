import {
  FindManyOptions,
  FindOptionsWhere,
  FindOptionsOrder,
  Like,
  FindOptionsSelect,
} from 'typeorm';
import { PaginationReqDto } from '../shared/request';
import { ShareEntity } from '../shared';
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
    sortString: string,
    options: FindManyOptions,
  ): void {
    if (sortString !== undefined && sortString.length > 0) {
      const sortOptions: Array<string> = sortString.split(',');
      let ordersOption: FindOptionsOrder<T> = {};
      sortOptions.forEach((option) => {
        const sortPair: Array<string> = option.split(':');
        if (
          sortPair[0] !== undefined &&
          sortPair[0] !== null &&
          sortPair[1] !== undefined &&
          sortPair[1] !== null
        ) {
          ordersOption = {
            ...ordersOption,
            [sortPair[0]]: sortPair[1],
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
    if (Object.keys(typeormWhereConditions)?.length === 0) {
      return;
    }

    if (Object.keys(typeormWhereConditions)?.length === 0) {
      return;
    }

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
  searchByConstant<T extends ShareEntity>(
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
          [key]: searchObject[key],
        });
      }
    });

    if (Object.keys(typeormWhereConditions)?.length === 0) {
      return;
    }

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
  selectColums<T extends ShareEntity>(
    columns: Array<string>,
    options: FindManyOptions,
  ): void {
    if (columns.length > 0) {
      let selectedColumns: FindOptionsSelect<T> = {};
      columns.forEach((column: string) => {
        selectedColumns = {
          ...selectedColumns,
          [column]: true,
        };
      });
      Object.assign(options, { select: selectedColumns });
    }
  },
};

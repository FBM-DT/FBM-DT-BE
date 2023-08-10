import {
  FindManyOptions,
  FindOptionsWhere,
  FindOptionsOrder,
  Like,
  FindOptionsSelect,
  FindOptionsRelations,
} from 'typeorm';
import { PaginationReqDto } from '../shared/request';
import { ShareEntity } from '../shared';
import { ISort } from '../abstract/interface';
import { ACCOUNT_ROLE, SEARCH_TYPE } from '../constants';

const ROLE_MAPPING = {
  [ACCOUNT_ROLE.ADM]: 1,
  [ACCOUNT_ROLE.SUPERVISOR]: 2,
  [ACCOUNT_ROLE.USER]: 3,
};

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
  searchByEnum<T extends ShareEntity>(
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
  selectWithRelations<T extends ShareEntity>(
    field: Array<string>,
    options: FindManyOptions,
  ): void {
    if (field.length > 0) {
      let selectedRelations: FindOptionsRelations<T> = {};
      field.forEach((relation: string) => {
        selectedRelations = {
          ...selectedRelations,
          [relation]: true,
        };
      });
      Object.assign(options, { relations: selectedRelations });
    }
  },
};

import { ShareEntity } from "../../shared";

export interface IGenericRepository<T extends ShareEntity> {
  add(data: Object): Promise<number>;
  update(data: Object, id: number): Promise<number>;
  delete(id: number): Promise<number>;
  findAll(): Promise<T[]>;
  findManyByConditions(conditions: Object): Promise<T[]>;
  findOneById(id: number): Promise<T>;
  findOneByConditions(conditions: Object): Promise<T>;
}

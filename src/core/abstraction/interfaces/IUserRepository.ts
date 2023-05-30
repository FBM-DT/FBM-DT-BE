import { User } from "../../../modules/users/user.entity";
import { IGenericRepository } from "./IGenericRepository";

export interface IUserRepository extends IGenericRepository<User>{
    /** Create any custom functions or methods for user repository here */
}
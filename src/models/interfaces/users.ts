import { Model } from "mongoose";
import { RoleName } from "./roles";
export declare interface UserIfc {
  username: string;
  password: string;
  email: string;
  roles: [{ name: RoleName; _id: string }];
  comparePassword: Function;
}

export declare interface UserModel extends Model<UserIfc> {
  encryptPassword(password: string): string;
}

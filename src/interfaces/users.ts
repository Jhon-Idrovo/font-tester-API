import { Model } from "mongoose";
import { RoleName } from "./roles";
export declare type AuthMethod = "google" | "facebook" | "twitter";
export declare interface UserIfc {
  _id: string;
  authMethod: AuthMethod;
  authProviderId?: string;
  username: string;
  password: string;
  email: string;
  role: { name: RoleName; _id: string };
  comparePassword: Function;
  stripeID?: string;
}

export declare interface UserModel extends Model<UserIfc> {
  encryptPassword(password: string): string;
}

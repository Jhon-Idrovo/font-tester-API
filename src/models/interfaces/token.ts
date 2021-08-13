import { JwtPayload } from "jsonwebtoken";
import { RoleName } from "./roles";

//for the model
export declare interface BlacklistedTokenInterface {
  token: string;
  userID: string;
}

//for the payload being sent into the token
export declare interface TokenPayloadInterface extends JwtPayload {
  userID: string;
  roles: RoleName[];
}

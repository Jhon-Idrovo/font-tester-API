import { Request } from "express";
import { TokenPayloadInterface } from "./token";

export declare interface RequestEnhanced extends Request {
  decodedToken: TokenPayloadInterface;
}

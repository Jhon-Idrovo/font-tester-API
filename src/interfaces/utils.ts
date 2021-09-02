import { AxiosError } from "axios";
import { Request } from "express";
import { TokenPayloadInterface } from "./token";

export declare interface RequestEnhanced extends Request {
  decodedToken: TokenPayloadInterface;
}
export declare interface ResponseError {
  error: { message: string; completeError?: Error | AxiosError };
}

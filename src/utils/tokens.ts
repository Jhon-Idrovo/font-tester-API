import jwt, { Secret } from "jsonwebtoken";
import { RoleName } from "../models/interfaces/roles";
import { TokenPayloadInterface } from "../models/interfaces/token";
import { accessTokenLifetime, refreshTokenLifetime } from "../config/config";
/**
 *
 * @param userID the generated user id
 * @returns jwt access token with user roles and id as payload
 */
export function generateAccessToken(userID: string, role: RoleName) {
  return jwt.sign(
    { userID, role } as TokenPayloadInterface,
    process.env.JWT_TOKEN_SECRET as Secret,
    {
      expiresIn: accessTokenLifetime,
    }
  );
}
/**
 * Verifies the given access or refresh token.
 * @param token jwt token issued previously
 * @returns payload if the token is valid. Otherwise, false.
 */
export function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, process.env.JWT_TOKEN_SECRET as Secret);
    return payload as TokenPayloadInterface;
  } catch (error) {
    return false;
  }
}
/**
 *
 * @param userID to be send as payload
 * @param roles to be send as payload
 * @returns a JWT token. Expiration time determined by the configuration file.
 */
export function generateRefreshToken(userID: string, role: RoleName) {
  return jwt.sign(
    { userID, role } as TokenPayloadInterface,
    process.env.JWT_TOKEN_SECRET as Secret,
    {
      expiresIn: refreshTokenLifetime,
    }
  );
}

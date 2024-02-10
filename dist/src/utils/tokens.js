"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.verifyToken = exports.generateAccessToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = require("../config/config");
/**
 *
 * @param userID the generated user id
 * @returns jwt access token with user roles and id as payload
 */
function generateAccessToken(userID, role, email, name, credits) {
    return jsonwebtoken_1.default.sign({ userID: userID, role: role, email: email, name: name, credits: credits }, process.env.JWT_TOKEN_SECRET, {
        expiresIn: config_1.accessTokenLifetime,
    });
}
exports.generateAccessToken = generateAccessToken;
/**
 * Verifies the given access or refresh token.
 * @param token jwt token issued previously
 * @returns payload if the token is valid. Otherwise, false.
 */
function verifyToken(token) {
    try {
        var payload = jsonwebtoken_1.default.verify(token, process.env.JWT_TOKEN_SECRET);
        return payload;
    }
    catch (error) {
        return false;
    }
}
exports.verifyToken = verifyToken;
/**
 *
 * @param userID to be send as payload
 * @param roles to be send as payload
 * @returns a JWT token. Expiration time determined by the configuration file.
 */
function generateRefreshToken(userID, role, email, name, credits) {
    return jsonwebtoken_1.default.sign({ userID: userID, role: role, email: email, name: name, credits: credits }, process.env.JWT_TOKEN_SECRET, {
        expiresIn: config_1.refreshTokenLifetime,
    });
}
exports.generateRefreshToken = generateRefreshToken;

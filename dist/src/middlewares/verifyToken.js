"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenMiddleware = void 0;
var tokens_1 = require("../utils/tokens");
/**
 * Verify the access token. If valid include the payload in the req's body.
 * If not, return an "Authorization failed" error message to the client.
 * @param req
 * @param res
 * @param next
 * @returns
 */
function verifyTokenMiddleware(req, res, next) {
    try {
        var token = req.headers.authorization.split(" ")[1];
        var payload = token ? tokens_1.verifyToken(token) : false;
        console.log("-----------------------TOKEN VERIFICATION----------------------- ");
        if (payload) {
            req.decodedToken = payload;
            return next();
        }
        return res.status(401).json({ error: { message: "Authorization failed" } });
    }
    catch (error) {
        return res.status(401).json({ error: { message: "Authorization failed" } });
    }
}
exports.verifyTokenMiddleware = verifyTokenMiddleware;

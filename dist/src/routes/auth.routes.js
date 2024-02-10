"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * endpoints for login and register
 */
var express_1 = require("express");
var passport_1 = __importDefault(require("passport"));
var AuthCtlr = __importStar(require("../controllers/auth.controller"));
var verifyToken_1 = require("../middlewares/verifyToken");
var router = express_1.Router();
router.post("/signin", AuthCtlr.signInHandler); //the access token is send here
router.post("/signup", AuthCtlr.signUpHandler);
router.post("/create-admin", AuthCtlr.createAdminHandler);
router.post("/send-recovery-code", AuthCtlr.sendRecoveryCode);
router.post("/verify-recovery-code", AuthCtlr.verifyRecoveryCode);
//sign in with Google
//scopes https://developers.google.com/identity/protocols/oauth2/scopes?authuser=1#google-sign-in
router.get("/google", AuthCtlr.handleGoogle);
//sign in with facebook
router.get("/facebook", passport_1.default.authenticate("facebook"));
router.get("/facebook/callback", passport_1.default.authenticate("facebook", { session: false, scope: "email" }), AuthCtlr.handleFacebook);
//sign in with twitter
router.get("/twitter", passport_1.default.authenticate("twitter", { session: false }));
router.get("/twitter/callback", passport_1.default.authenticate("twitter", { session: false }), AuthCtlr.handleTwitter);
router.use(verifyToken_1.verifyTokenMiddleware);
router.post("/signout", AuthCtlr.signOutHandler);
router.post("/change-password", AuthCtlr.changePassword);
router.post("/delete-user", AuthCtlr.deleteUser);
exports.default = router;

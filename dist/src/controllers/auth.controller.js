"use strict";
/**
 * logic for handling auth requests
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.changePassword = exports.handleTwitter = exports.handleFacebook = exports.handleGoogle = exports.createAdminHandler = exports.signUpHandler = exports.signOutHandler = exports.verifyRecoveryCode = exports.sendRecoveryCode = exports.signInHandler = void 0;
var Role_1 = __importDefault(require("../models/Role"));
var User_1 = __importDefault(require("../models/User"));
var BlacklistedToken_1 = __importDefault(require("../models/BlacklistedToken"));
var tokens_1 = require("../utils/tokens");
var passport_1 = __importDefault(require("passport"));
var config_1 = require("../config/config");
var RecoveryCode_1 = __importDefault(require("../models/RecoveryCode"));
var codes_1 = require("../utils/codes");
var nodemailer_1 = require("../config/nodemailer");
/**
 * Verifies username and password against the database. If good, returns an object
 * with an access token and refresh token. The user role are send in the payload of the
 * access token. The role need to be decrypted only on the server because we can't share
 * the decoding secret safely with the client.
 * @param req
 * @param res
 * @param next
 */
function signInHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, email, password, user, userRole, refreshToken, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("----------------------SIGN IN--------------------------------");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    _a = req.body, email = _a.email, password = _a.password;
                    return [4 /*yield*/, User_1.default.findOne({ email: email }).populate("role").exec()];
                case 2:
                    user = _b.sent();
                    if (!user) return [3 /*break*/, 4];
                    if (user.authMethod !== "native")
                        return [2 /*return*/, res
                                .status(400)
                                .json({
                                error: {
                                    message: "This account is associated with a " + user.authMethod + " account. Please use that login method  ",
                                },
                            })];
                    console.log(user);
                    return [4 /*yield*/, user.comparePassword(user.password, password)];
                case 3:
                    //compare passwords
                    if (_b.sent()) {
                        userRole = user.role.name;
                        refreshToken = tokens_1.generateRefreshToken(user._id, userRole, user.email, user.username, user.credits);
                        return [2 /*return*/, res.status(200).json({
                                accessToken: tokens_1.generateAccessToken(user._id, userRole, user.email, user.username, user.credits),
                                refreshToken: refreshToken,
                                //this is optional, you should not rely on this to grant access to any
                                //protected resorce on the client because it's easy to modify.
                                //And we can't very the signature on the client.
                                //Instead, use the access token payload on the server.
                                //role: userRole,
                            })];
                    }
                    else {
                        return [2 /*return*/, res
                                .status(400)
                                .json({ error: { message: "Invalid password" }, token: null })];
                    }
                    _b.label = 4;
                case 4: return [2 /*return*/, res.status(400).json({ error: { message: "User not found" } })];
                case 5:
                    error_1 = _b.sent();
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: { message: error_1.message } })];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.signInHandler = signInHandler;
function sendRecoveryCode(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var email, user, code, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    email = req.body.email;
                    return [4 /*yield*/, User_1.default.findOne({ email: email })];
                case 1:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/, res.status(400).json({ error: { message: "User not found" } })];
                    code = codes_1.generateCode();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, RecoveryCode_1.default.create({
                            userId: user._id,
                            // adjusting for changes in tiezones and more
                            iat: Date.now() - 86400000,
                            code: code,
                        })];
                case 3:
                    _a.sent();
                    console.log(user.email);
                    // const a = await SendgridClient.send({
                    //   to: { name: user.username, email: user.email },
                    //   from: { email: "font.tester.app@gmail.com", name: "Font Tester" },
                    //   templateId: "a9ba698b-cd40-441a-a6a2-1a7462d9f13c",
                    //   subject: "Recovery Code",
                    //   dynamicTemplateData: { name: user.username, code },
                    // });
                    // console.log(a);
                    return [4 /*yield*/, nodemailer_1.transporter.sendMail({
                            from: "'Font Tester' <font.tester.app@gmail.com>",
                            to: user.email,
                            subject: "Recovery Password",
                            html: '<div style="width:100%;height:100%"><h1>Font Tester</h1><p>To continue with your account recovery process, please write the following code on our site.</p><h2>' +
                                code +
                                "</h2><p>If you were not expecting this message, please verify the security of your email account.</p></div>",
                        })];
                case 4:
                    // const a = await SendgridClient.send({
                    //   to: { name: user.username, email: user.email },
                    //   from: { email: "font.tester.app@gmail.com", name: "Font Tester" },
                    //   templateId: "a9ba698b-cd40-441a-a6a2-1a7462d9f13c",
                    //   subject: "Recovery Code",
                    //   dynamicTemplateData: { name: user.username, code },
                    // });
                    // console.log(a);
                    _a.sent();
                    return [2 /*return*/, res.send()];
                case 5:
                    error_2 = _a.sent();
                    console.log(error_2.response.body);
                    return [2 /*return*/, res.status(400).json({
                            error: {
                                message: "Unable to generate the code, please try again later",
                            },
                        })];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.sendRecoveryCode = sendRecoveryCode;
function verifyRecoveryCode(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, code, email, recoveryCod, _b, _id, role, userEmail, username, credits, accessToken, refreshToken;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = req.body, code = _a.code, email = _a.email;
                    return [4 /*yield*/, RecoveryCode_1.default.findOne({ code: code })];
                case 1:
                    recoveryCod = _c.sent();
                    if (!recoveryCod)
                        return [2 /*return*/, res.status(400).json({
                                error: {
                                    message: "Sorry, we can't find that code, please try again or try a new code",
                                },
                            })];
                    return [4 /*yield*/, recoveryCod
                            .populate("userId")
                            .populate({ path: "userId", populate: { path: "role" } })
                            .execPopulate()];
                case 2:
                    _c.sent();
                    console.log(recoveryCod.userId);
                    _b = recoveryCod.userId, _id = _b._id, role = _b.role, userEmail = _b.email, username = _b.username, credits = _b.credits;
                    accessToken = tokens_1.generateAccessToken(_id, role.name, userEmail, username, credits);
                    refreshToken = tokens_1.generateRefreshToken(_id, role.name, userEmail, username, credits);
                    if (recoveryCod.userId.email === email && recoveryCod.iat < Date.now()) {
                        recoveryCod.delete();
                        return [2 /*return*/, res.json({
                                redirect: "/password-change/?at=" + accessToken + "&rt=" + refreshToken,
                            })];
                    }
                    return [2 /*return*/, res.status(400).json({
                            error: { message: "Invalid code" },
                        })];
            }
        });
    });
}
exports.verifyRecoveryCode = verifyRecoveryCode;
/**
 * Deletes the refresh token from the database and invalidates the access token.
 * This method is optional since deleting the tokens on the client logs out
 * succesfully. This method is more needed when someone steals a refresh token.
 * In this case, the user should request the log out througth this method.
 * @param req
 * @param res
 * @param next
 */
function signOutHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var refreshToken, payload, newBlacklistedTkn, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    refreshToken = req.headers.authorization;
                    payload = refreshToken ? tokens_1.verifyToken(refreshToken) : null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    if (!payload) return [3 /*break*/, 3];
                    return [4 /*yield*/, new BlacklistedToken_1.default({
                            token: refreshToken,
                            userID: payload.userID,
                        }).save()];
                case 2:
                    newBlacklistedTkn = _a.sent();
                    return [2 /*return*/, res.status(200)];
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    return [2 /*return*/, res.status(400).json({ error: error_3 })];
                case 5: return [2 /*return*/, res.status(400).json({ error: "Invalid refresh token" })];
            }
        });
    });
}
exports.signOutHandler = signOutHandler;
/**
 * Given a username, email and password, creates a new user assgining it a 'User' role
 * returns a jwt to the server or an error
 * @param req
 * @param res
 * @param next
 */
function signUpHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, username, password, email, userRole, user, _b, newRole, refreshToken, error_4, errContent;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = req.body, username = _a.username, password = _a.password, email = _a.email;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, Role_1.default.findOne({ name: "User" })];
                case 2:
                    userRole = _d.sent();
                    _b = User_1.default.bind;
                    _c = {
                        username: username,
                        email: email
                    };
                    return [4 /*yield*/, User_1.default.encryptPassword(password)];
                case 3: return [4 /*yield*/, new (_b.apply(User_1.default, [void 0, (_c.password = _d.sent(),
                            // to avoid
                            _c.authMethod = "native",
                            _c.credits = 10,
                            _c.role = userRole === null || userRole === void 0 ? void 0 : userRole._id,
                            _c)]))().save()];
                case 4:
                    user = _d.sent();
                    return [4 /*yield*/, user.populate("role", "name -_id").execPopulate()];
                case 5:
                    _d.sent();
                    newRole = user.role.name;
                    refreshToken = tokens_1.generateRefreshToken(user._id, newRole, user.email, user.username, user.credits);
                    return [2 /*return*/, res.status(201).json({
                            accessToken: tokens_1.generateAccessToken(user._id, newRole, user.email, user.username, user.credits),
                            refreshToken: refreshToken,
                            user: user,
                        })];
                case 6:
                    error_4 = _d.sent();
                    console.log("Error on signup process:", error_4);
                    errContent = { message: "" };
                    switch (error_4.name) {
                        case "MongoError":
                            switch (error_4.code) {
                                case 11000: //generally error 11000 is caused by existing records
                                    //since there is only one unique field on User we can assume it's the cause
                                    errContent = {
                                        message: "There already exists an account associated to this email",
                                    };
                                    break;
                                default:
                                    errContent = {
                                        message: "An unidentified error happened. We are workin to solve it as soon as possible",
                                    };
                                    break;
                            }
                            break;
                        //normal node error
                        default:
                            break;
                    }
                    return [2 /*return*/, res.status(400).json({ error: errContent })];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.signUpHandler = signUpHandler;
/**
 * Given the email, username, password and correct admin access password,
 * it creates a new user with a role of "Admin"
 * Then, it sends back to the client a jwt token.
 * @param req
 * @param res
 * @param next
 */
function createAdminHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, username, password, email, adminAccessPassword, adminRole, admin, _b, error_5;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, , 6]);
                    _a = req.body, username = _a.username, password = _a.password, email = _a.email, adminAccessPassword = _a.adminAccessPassword;
                    if (!(adminAccessPassword === process.env.CREATE_ADMIN_PASSWORD)) return [3 /*break*/, 4];
                    return [4 /*yield*/, Role_1.default.findOne({ name: "Admin" })];
                case 1:
                    adminRole = _d.sent();
                    _b = User_1.default.bind;
                    _c = {
                        username: username,
                        email: email
                    };
                    return [4 /*yield*/, User_1.default.encryptPassword(password)];
                case 2: return [4 /*yield*/, new (_b.apply(User_1.default, [void 0, (
                        //we don't need the await in this call but an error detects it as promise even if it is not
                        _c.password = _d.sent(),
                            _c.role = adminRole === null || adminRole === void 0 ? void 0 : adminRole._id,
                            _c)]))().save()];
                case 3:
                    admin = _d.sent();
                    return [2 /*return*/, res.status(201).json({
                            accessToken: tokens_1.generateAccessToken(admin._id, "Admin", admin.email, admin.email, admin.credits),
                        })];
                case 4:
                    res.json({ error: "Admin access password invalid" });
                    return [3 /*break*/, 6];
                case 5:
                    error_5 = _d.sent();
                    return [2 /*return*/, res.status(400).json({ error: error_5 })];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.createAdminHandler = createAdminHandler;
/**
 * This is excuted before the passport strategy handler, which
 * recieves the user data and fetches/creates the user. Then that user
 * is passed to this function with the roles populated.
 * @param req
 * @param res
 * @param next
 */
function handleGoogle(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("here");
            passport_1.default.authenticate("google", { scope: ["profile", "email"], session: false }, function (err, user, userInfo) {
                console.log(err, user, userInfo);
                //roles are populated
                var role = user.role.name;
                var accesToken = tokens_1.generateAccessToken(user._id, role, user.email, user.username, user.credits);
                var refreshToken = tokens_1.generateRefreshToken(user._id, role, user.email, user.username, user.credits);
                console.log("redirecting", refreshToken);
                if (role === "Guest") {
                    //redirect to complete signup
                    return res.redirect(config_1.clientDomainPath + "/signup?at=" + accesToken + "&rt=" + refreshToken);
                }
                return res.redirect(config_1.clientDomainPath + "/?at=" + accesToken + "&rt=" + refreshToken);
            })(req, res, next);
            return [2 /*return*/];
        });
    });
}
exports.handleGoogle = handleGoogle;
function handleFacebook(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var user, role, accesToken, refreshToken;
        return __generator(this, function (_a) {
            console.log("handleFacebook REQUEST:------------------");
            user = req.user;
            role = user.role.name;
            accesToken = tokens_1.generateAccessToken(user._id, role, user.email, user.username, user.credits);
            refreshToken = tokens_1.generateRefreshToken(user._id, role, user.email, user.username, user.credits);
            console.log("redirecting");
            if (role === "Guest") {
                //redirect to complete signup
                return [2 /*return*/, res.redirect(config_1.clientDomainPath + "/signup?at=" + accesToken + "&rt=" + refreshToken)];
            }
            return [2 /*return*/, res.redirect(config_1.clientDomainPath + "/?at=" + accesToken + "&rt=" + refreshToken)];
        });
    });
}
exports.handleFacebook = handleFacebook;
function handleTwitter(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var user, role, accesToken, refreshToken;
        return __generator(this, function (_a) {
            console.log("handleTwitter", req.user);
            user = req.user;
            role = user.role.name;
            accesToken = tokens_1.generateAccessToken(user._id, role, user.email, user.username, user.credits);
            refreshToken = tokens_1.generateRefreshToken(user._id, role, user.email, user.username, user.credits);
            console.log("redirecting", config_1.clientDomainPath);
            if (role === "Guest") {
                //redirect to complete signup
                return [2 /*return*/, res.redirect(config_1.clientDomainPath + "/signup?at=" + accesToken + "&rt=" + refreshToken)];
            }
            return [2 /*return*/, res.redirect(config_1.clientDomainPath + "/?at=" + accesToken + "&rt=" + refreshToken)];
        });
    });
}
exports.handleTwitter = handleTwitter;
/**
 *
 * @param req
 * @param res
 * @param next
 */
function changePassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var userID, newPassword, user, _a, error_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    userID = req.decodedToken.userID;
                    newPassword = req.body.newPassword;
                    return [4 /*yield*/, User_1.default.findById(userID)];
                case 1:
                    user = _b.sent();
                    if (!user)
                        return [2 /*return*/, res.status(400).json({ error: { message: "User not found" } })];
                    _a = user;
                    return [4 /*yield*/, User_1.default.encryptPassword(newPassword)];
                case 2:
                    _a.password = _b.sent();
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, user.save()];
                case 4:
                    _b.sent();
                    return [2 /*return*/, res.send()];
                case 5:
                    error_6 = _b.sent();
                    console.log(error_6);
                    return [2 /*return*/, res.status(400).json({
                            error: { message: "Unable to update", completeError: error_6 },
                        })];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.changePassword = changePassword;
/**
 *
 * @param req
 * @param res
 * @param next
 */
function deleteUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var userID, user, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userID = req.decodedToken.userID;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, User_1.default.findById(userID)];
                case 2:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/, res.status(400).json({ error: { message: "User not found" } })];
                    return [4 /*yield*/, user.delete()];
                case 3:
                    _a.sent();
                    res.send();
                    return [3 /*break*/, 5];
                case 4:
                    error_7 = _a.sent();
                    console.log(error_7);
                    return [2 /*return*/, res.status(400).json({
                            error: { message: "Unable to update", completeError: error_7 },
                        })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.deleteUser = deleteUser;

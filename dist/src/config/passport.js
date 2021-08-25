"use strict";
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
exports.twitterCbURL = exports.facebookCbURL = exports.googleRedirectUrl = void 0;
var passport_1 = __importDefault(require("passport"));
var passport_google_oauth2_1 = require("passport-google-oauth2");
var passport_twitter_1 = require("passport-twitter");
var passport_facebook_1 = require("passport-facebook");
var User_1 = __importDefault(require("../models/User"));
var config_1 = require("./config");
var Role_1 = __importDefault(require("../models/Role"));
exports.googleRedirectUrl = config_1.basePath + "/auth/google";
passport_1.default.use(new passport_google_oauth2_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: exports.googleRedirectUrl,
}, function (accessToken, refreshToken, userInfo, cb) {
    return __awaiter(this, void 0, void 0, function () {
        var role, id, displayName, email, picture, user, newUser, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("user info: ", userInfo);
                    return [4 /*yield*/, Role_1.default.findOne({ name: "User" })];
                case 1:
                    role = _a.sent();
                    id = userInfo.id, displayName = userInfo.displayName, email = userInfo.email, picture = userInfo.picture;
                    return [4 /*yield*/, User_1.default.findOne({ email: email, username: displayName })
                            .populate("roles", "name")
                            .exec()];
                case 2:
                    user = _a.sent();
                    //user already exists
                    if (user) {
                        console.log("user found", user);
                        return [2 /*return*/, cb(null, user)];
                    }
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, User_1.default.create({
                            username: displayName,
                            password: "empty",
                            authMethod: "google",
                            email: email,
                            roles: role === null || role === void 0 ? void 0 : role._id,
                        })];
                case 4:
                    newUser = _a.sent();
                    //populate to avoid refetching on the next function
                    newUser.populate("roles", "name");
                    return [2 /*return*/, cb(null, newUser)];
                case 5:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [2 /*return*/, cb(error_1, null)];
                case 6: return [2 /*return*/];
            }
        });
    });
}));
exports.facebookCbURL = config_1.basePath + "/auth/facebook";
passport_1.default.use(new passport_facebook_1.Strategy({
    callbackURL: exports.facebookCbURL,
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    //https://developers.facebook.com/docs/graph-api/reference/v2.5/user
    profileFields: ["id", "name", "picture", "email"],
}, function (accessToken, refreshToken, userInfo, cb) {
    return __awaiter(this, void 0, void 0, function () {
        var role;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("user info: ", userInfo);
                    return [4 /*yield*/, Role_1.default.findOne({ name: "User" })];
                case 1:
                    role = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}));
exports.twitterCbURL = config_1.basePath + "/auth/twitter";
passport_1.default.use(new passport_twitter_1.Strategy({
    consumerKey: process.env.TWITTER_API_KEY,
    consumerSecret: process.env.TWITTER_API_SECRET,
    callbackURL: exports.twitterCbURL,
}, function (token, tokenSecret, profile, cb) {
    console.log(profile);
}));
console.log("Passport initialized");
// passport.use(
//   new Strategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//       authorizationURL: "https://www.example.com/oauth2/authorize",
//       tokenURL: "https://www.example.com/oauth2/token",
//       callbackURL: "http://localhost:3000/auth/example/callback",
//     },
//     async (
//       accessToken: string,
//       refreshToken: string,
//       profile,
//       cb: Function
//     ) => {
//       console.log(profile);
//       const { id, displayName } = profile;
//       const user = await User.findById(profile.id);
//       if (user) return user;
//       const newUser = User.create({
//         username: displayName,
//         //this needs to be an ObjectId instance?
//         _id: id,
//         password: "",
//         authMethod: "google",
//         email: "",
//         roles: "",
//       });
//     }
//   )
// );

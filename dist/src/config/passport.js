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
var users_1 = require("../utils/users");
exports.googleRedirectUrl = "https://fonttester-413418.uc.r.appspot.com/api/v3/auth/google";
passport_1.default.use(new passport_google_oauth2_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: exports.googleRedirectUrl,
}, function (accessToken, refreshToken, userInfo, cb) {
    return __awaiter(this, void 0, void 0, function () {
        var id, displayName, email, picture, user, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("user info: ", userInfo);
                    id = userInfo.id, displayName = userInfo.displayName, email = userInfo.email, picture = userInfo.picture;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, users_1.getOrCreateUser(email, displayName, "google", "empty", id)];
                case 2:
                    user = _a.sent();
                    //populate to avoid refetching on the next function
                    return [4 /*yield*/, user.populate("role", "name").execPopulate()];
                case 3:
                    //populate to avoid refetching on the next function
                    _a.sent();
                    return [2 /*return*/, cb(null, user)];
                case 4:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [2 /*return*/, cb(error_1, null)];
                case 5: return [2 /*return*/];
            }
        });
    });
}));
exports.facebookCbURL = "https://fonttester-413418.uc.r.appspot.com/api/v3/auth/facebook/callback";
passport_1.default.use(new passport_facebook_1.Strategy({
    callbackURL: exports.facebookCbURL,
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    //https://developers.facebook.com/docs/graph-api/reference/v2.5/user
    profileFields: ["id", "name", "picture", "email"],
}, function (accessToken, refreshToken, userInfo, cb) {
    return __awaiter(this, void 0, void 0, function () {
        var displayName, id, emails, user, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("on passport strategy, user info: ", userInfo);
                    displayName = userInfo.displayName, id = userInfo.id, emails = userInfo.emails;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    if (!emails)
                        return [2 /*return*/, cb(new Error("User doesn't have an email associated with its account"))];
                    return [4 /*yield*/, users_1.getOrCreateUser(emails[0].value, displayName, "facebook", "facebook", id)];
                case 2:
                    user = _a.sent();
                    return [2 /*return*/, cb(null, user)];
                case 3:
                    error_2 = _a.sent();
                    console.log(error_2);
                    return [2 /*return*/, cb(error_2, null)];
                case 4: return [2 /*return*/];
            }
        });
    });
}));
exports.twitterCbURL = "https://fonttester-413418.uc.r.appspot.com/api/v3/auth/twitter/callback";
passport_1.default.use(new passport_twitter_1.Strategy({
    consumerKey: process.env.TWITTER_API_KEY,
    consumerSecret: process.env.TWITTER_API_SECRET,
    callbackURL: exports.twitterCbURL,
    includeEmail: true,
}, function (token, tokenSecret, profile, cb) {
    return __awaiter(this, void 0, void 0, function () {
        var displayName, emails, id, user, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("on passport. Profile:", profile);
                    displayName = profile.displayName, emails = profile.emails, id = profile.id;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    if (!emails)
                        return [2 /*return*/, cb(new Error("User doesn't have an email associated with its account"), null)];
                    return [4 /*yield*/, users_1.getOrCreateUser(emails[0].value, displayName, "twitter", "twitter", id)];
                case 2:
                    user = _a.sent();
                    //populate user
                    return [4 /*yield*/, user.populate("role").execPopulate()];
                case 3:
                    //populate user
                    _a.sent();
                    return [2 /*return*/, cb(null, user)];
                case 4:
                    error_3 = _a.sent();
                    console.log(error_3);
                    return [2 /*return*/, cb(error_3, null)];
                case 5: return [2 /*return*/];
            }
        });
    });
}));
// passport.serializeUser(function (user, done) {
//   console.log(user);
//   done(null, (user as UserIfc)._id);
// });
// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });
console.log("Passport initialized");

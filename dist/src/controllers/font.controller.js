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
exports.deleteDisliked = exports.saveDisliked = exports.getDisliked = exports.deleteLikedMatch = exports.getLikedFonts = exports.saveLikedFonts = void 0;
var Fonts_User_Liked_1 = __importDefault(require("../models/Fonts_User_Liked"));
var Font_User_Disliked_1 = __importDefault(require("../models/Font_User_Disliked"));
var User_1 = __importDefault(require("../models/User"));
var fonts_1 = require("../utils/fonts");
var users_1 = require("../utils/users");
/**
 * Given a list of list of matching object fonts, save the list to the
 * database using a relation Fonts_User
 * @param req
 * @param res
 * @param next
 */
function saveLikedFonts(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var userID, _a, likedFonts, creditAmount, fontsPromises, fonts, fonts_userPromises, r, user, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    userID = req.decodedToken.userID;
                    _a = req.body, likedFonts = _a.likedFonts, creditAmount = _a.creditAmount;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    fontsPromises = likedFonts.map(function (matchingFonts) {
                        return Promise.all(matchingFonts.map(function (fontObj) {
                            return fonts_1.findOrCreateFont(fontObj.family, fontObj.category);
                        }));
                    });
                    return [4 /*yield*/, Promise.all(fontsPromises)];
                case 2:
                    fonts = _b.sent();
                    console.log(fonts);
                    fonts_userPromises = fonts.map(function (matchingFonts) {
                        return Fonts_User_Liked_1.default.create({
                            fonts_ids: matchingFonts.map(function (fontObj) { return fontObj._id; }),
                            user_id: userID,
                        });
                    });
                    return [4 /*yield*/, Promise.all(fonts_userPromises)];
                case 3:
                    r = _b.sent();
                    return [4 /*yield*/, User_1.default.findById(userID)];
                case 4:
                    user = _b.sent();
                    if (!user)
                        return [2 /*return*/, res.status(400).json({ error: { message: "User not found" } })];
                    return [4 /*yield*/, users_1.modifyCredit(user, -1)];
                case 5:
                    _b.sent();
                    return [2 /*return*/, res.send()];
                case 6:
                    error_1 = _b.sent();
                    console.log(error_1);
                    return [2 /*return*/, res.status(400).json({ error: { message: error_1.message } })];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.saveLikedFonts = saveLikedFonts;
/**
 * Using the userID from the token, retieve the Fonts_User_Liked
 * @param req
 * @param res
 * @param next
 * @returns
 */
function getLikedFonts(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var userID, liked, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userID = req.decodedToken.userID;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Fonts_User_Liked_1.default.find({ user_id: userID })
                            .populate("fonts_ids", "family category")
                            .exec()];
                case 2:
                    liked = _a.sent();
                    res.json({ likedFonts: liked });
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.log(error_2);
                    return [2 /*return*/, res.status(400).json({
                            error: { message: "Sorry we can't find the fonts. Try again." },
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getLikedFonts = getLikedFonts;
/**
 * Deletes a match (group of fonts) from the Fonts_User_Liked collection
 * @param req
 * @param res
 * @param next
 * @returns
 */
function deleteLikedMatch(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var match_id, deleted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    match_id = req.params.match_id;
                    return [4 /*yield*/, Fonts_User_Liked_1.default.findByIdAndDelete(match_id).exec()];
                case 1:
                    deleted = _a.sent();
                    return [2 /*return*/, deleted
                            ? res.send()
                            : res.status(400).json({ error: { message: "Error deleting the match" } })];
            }
        });
    });
}
exports.deleteLikedMatch = deleteLikedMatch;
function getDisliked(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var userID, dislikedFonts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userID = req.decodedToken.userID;
                    return [4 /*yield*/, Font_User_Disliked_1.default.find({ user_id: userID })
                            .populate("font_id")
                            .exec()];
                case 1:
                    dislikedFonts = _a.sent();
                    res.json({ dislikedFonts: dislikedFonts });
                    return [2 /*return*/];
            }
        });
    });
}
exports.getDisliked = getDisliked;
function saveDisliked(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var userID, _a, family, category, font, f, newDoc, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    userID = req.decodedToken.userID;
                    _a = req.body.dislikedFont, family = _a.family, category = _a.category;
                    return [4 /*yield*/, fonts_1.findOrCreateFont(family, category)];
                case 1:
                    font = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, Font_User_Disliked_1.default.findOne({
                            font_id: font._id,
                            user_id: userID,
                        }).exec()];
                case 3:
                    f = _b.sent();
                    if (f)
                        return [2 /*return*/, res.send()];
                    return [4 /*yield*/, Font_User_Disliked_1.default.create({
                            font_id: font._id,
                            user_id: userID,
                        })];
                case 4:
                    newDoc = _b.sent();
                    return [2 /*return*/, res.send()];
                case 5:
                    error_3 = _b.sent();
                    console.log(error_3);
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: { message: "Error saving to the database" } })];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.saveDisliked = saveDisliked;
function deleteDisliked(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var userID, deleted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userID = req.decodedToken.userID;
                    return [4 /*yield*/, Font_User_Disliked_1.default.findByIdAndDelete(req.params.font_userId)];
                case 1:
                    deleted = _a.sent();
                    return [2 /*return*/, deleted
                            ? res.send()
                            : res.status(400).json({ error: { message: "Error deleting the record" } })];
            }
        });
    });
}
exports.deleteDisliked = deleteDisliked;
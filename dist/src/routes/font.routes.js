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
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var verifyToken_1 = require("../middlewares/verifyToken");
var FontCtlr = __importStar(require("../controllers/font.controller"));
var router = express_1.Router();
router.use(verifyToken_1.verifyTokenMiddleware);
router.post("/save-liked", FontCtlr.saveLikedFonts);
router.get("/liked", FontCtlr.getLikedFonts);
router.delete("/delete-liked/:match_id", FontCtlr.deleteLikedMatch);
router.post("/save-disliked", FontCtlr.saveDisliked);
router.get("/disliked", FontCtlr.getDisliked);
router.delete("/delete-disliked/:font_userId", FontCtlr.deleteDisliked);
exports.default = router;

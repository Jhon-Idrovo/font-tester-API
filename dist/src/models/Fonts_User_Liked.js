"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var fonts_userSchema = new mongoose_1.Schema({
    fonts_ids: [{ ref: "Font", type: mongoose_1.Schema.Types.ObjectId, require: true }],
    user_id: { ref: "User", type: mongoose_1.Schema.Types.ObjectId, require: true },
});
exports.default = mongoose_1.model("Fonts_User_Liked", fonts_userSchema);

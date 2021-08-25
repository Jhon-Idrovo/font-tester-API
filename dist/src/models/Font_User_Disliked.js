"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var dislikedFontsSchema = new mongoose_1.Schema({
    user_id: { ref: "User", type: mongoose_1.Schema.Types.ObjectId },
    font_id: { ref: "Font", type: mongoose_1.Schema.Types.ObjectId },
});
exports.default = mongoose_1.model("Font_User_Disliked", dislikedFontsSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var blacklistedTokenSchema = new mongoose_1.Schema({
    token: { type: String, require: true },
    //this could be a reference either
    //if unique, the user wouldn't be able to login in multiple devices
    userID: { type: mongoose_1.Types.ObjectId, unique: false },
});
exports.default = mongoose_1.model("BlacklistedToken", blacklistedTokenSchema);

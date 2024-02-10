"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var schema = new mongoose_1.Schema({
    code: Number,
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", require: true },
    iat: Number,
});
exports.default = mongoose_1.model("RecoveryCode", schema);

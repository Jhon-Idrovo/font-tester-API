"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var fontSchema = new mongoose_1.Schema({
    family: { type: String, require: true, unique: true },
    category: String,
});
exports.default = mongoose_1.model("Font", fontSchema);

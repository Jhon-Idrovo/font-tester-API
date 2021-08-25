"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var roleSchema = new mongoose_1.Schema({
    name: String,
});
exports.default = mongoose_1.model("Role", roleSchema);

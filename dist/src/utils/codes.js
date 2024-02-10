"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCode = void 0;
function generateCode() {
    var code = Array(6);
    for (var i = 0; i < code.length; i++) {
        code[i] = Math.floor(Math.random() * 9);
    }
    console.log(code);
    return code.join("");
}
exports.generateCode = generateCode;

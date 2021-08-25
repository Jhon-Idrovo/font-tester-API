"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ejm_1 = __importDefault(require("../src/ejm"));
test("adds 1 + 2 to equal 3", function () {
    expect(ejm_1.default(1, 2)).toBe(3);
});

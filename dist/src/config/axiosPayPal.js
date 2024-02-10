"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var config_1 = require("./config");
var axiosPayPal = axios_1.default.create({
    baseURL: config_1.PAYPAL_API_URL,
    headers: {
        //https://developer.paypal.com/docs/platforms/get-started/
        Authorization: config_1.PAYPAL_AUTH,
        "Content-Type": "application/json",
    },
});
exports.default = axiosPayPal;

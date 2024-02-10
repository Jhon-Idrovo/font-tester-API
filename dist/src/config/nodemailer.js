"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
var nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "font.tester.app@gmail.com",
        pass: process.env.GOOGLE_APP_KEY, //created by google following https://www.youtube.com/watch?v=KjheexBLY4A
    },
});
exports.transporter
    .verify()
    .then(function () { return console.log("Ready for send emails"); })
    .catch(function (err) {
    return console.log("An error happened while seting up the email service", err);
});

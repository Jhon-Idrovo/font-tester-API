"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * express app configuration
 */
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var morgan_1 = __importDefault(require("morgan"));
var auth_routes_1 = __importDefault(require("./auth.routes"));
var token_routes_1 = __importDefault(require("./token.routes"));
var user_routes_1 = __importDefault(require("./user.routes"));
var subscription_routes_1 = __importDefault(require("./subscription.routes"));
var webhook_routes_1 = __importDefault(require("./webhook.routes"));
var font_routes_1 = __importDefault(require("./font.routes"));
var config_1 = require("../config/config");
var passport_1 = __importDefault(require("passport"));
var app = express_1.default();
//use JSON for non-webhook routes
app.use(function (req, res, next) {
    console.log("ORIGINAL URL:", req.originalUrl);
    return req.originalUrl === "/api/v3/webhook"
        ? express_1.default.raw({ type: "application/json" })(req, res, next)
        : express_1.default.json()(req, res, next);
});
app.use(cors_1.default());
app.use(morgan_1.default("dev"));
//initialize passport
app.use(passport_1.default.initialize());
app.use(config_1.basePath + "/auth", auth_routes_1.default);
app.use(config_1.basePath + "/tokens", token_routes_1.default);
app.use(config_1.basePath + "/users", user_routes_1.default);
app.use(config_1.basePath + "/subscriptions", subscription_routes_1.default);
app.use(config_1.basePath + "/webhook", webhook_routes_1.default);
app.use(config_1.basePath + "/fonts", font_routes_1.default);
//handle wrong paths
app.use("*", function (req, res) {
    return res.status(404).json({ error: "Page not found" });
});
exports.default = app;

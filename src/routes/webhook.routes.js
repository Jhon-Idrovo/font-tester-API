"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var webhook_controller_1 = require("../controllers/webhook.controller");
var router = express_1.Router();
router.post("/", webhook_controller_1.handleWebHook);
exports.default = router;

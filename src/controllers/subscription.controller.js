"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubscription = exports.getPrices = exports.cancelSubscription = exports.listSubscriptions = exports.createElementsSubscription = void 0;
var stripe_1 = require("../config/stripe");
var User_1 = __importDefault(require("../models/User"));
var stripe_2 = require("../utils/stripe");
/**
 * At this point the user is authenticated and it's information is
 * stored on req.decodedToken. Which is derived from the access token.
 */
/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
function createElementsSubscription(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, priceId, paymentMethod, userID, user, customer, subscription, invoice, paymentIntent, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("-----------------------CREATING SUBSCRIPTION--------------------------");
                    _a = req.body, priceId = _a.priceId, paymentMethod = _a.paymentMethod;
                    userID = req.decodedToken.userID;
                    return [4 /*yield*/, User_1.default.findById(userID).exec()];
                case 1:
                    user = _b.sent();
                    if (!user)
                        return [2 /*return*/, res.status(400).json({ error: { message: "User not found" } })];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 7, , 8]);
                    return [4 /*yield*/, stripe_2.getOrCreateCustomer(user)];
                case 3:
                    customer = _b.sent();
                    //attach the payment method to the customer
                    return [4 /*yield*/, stripe_1.stripe.paymentMethods.attach(paymentMethod, {
                            customer: customer.id,
                        })];
                case 4:
                    //attach the payment method to the customer
                    _b.sent();
                    //set the default payment method
                    return [4 /*yield*/, stripe_1.stripe.customers.update(customer.id, {
                            invoice_settings: { default_payment_method: paymentMethod },
                        })];
                case 5:
                    //set the default payment method
                    _b.sent();
                    return [4 /*yield*/, stripe_1.stripe.subscriptions.create({
                            customer: customer.id,
                            items: [
                                {
                                    price: priceId,
                                },
                            ],
                            payment_behavior: "default_incomplete",
                            expand: ["latest_invoice.payment_intent"],
                        })];
                case 6:
                    subscription = _b.sent();
                    invoice = subscription.latest_invoice;
                    paymentIntent = invoice.payment_intent;
                    console.log("-----------Subscription:", subscription, "----------Customer:", customer, "--------USER:", user);
                    res.send({
                        payment_intent: paymentIntent,
                    });
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _b.sent();
                    console.log("-------------------ERROR CREATING SUBSCRIPTION: ", error_1);
                    return [2 /*return*/, res.status(400).send({
                            error: {
                                message: "Error creating subscription, please try again.",
                                complete: error_1,
                            },
                        })];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.createElementsSubscription = createElementsSubscription;
/**
 *Can be optimized since we retrieve the user
 * @param req
 * @param res
 * @param next
 * @returns
 */
function listSubscriptions(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var userID, user, customer, subscriptions, _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    userID = req.decodedToken.userID;
                    return [4 /*yield*/, User_1.default.findById(userID).exec()];
                case 1:
                    user = _d.sent();
                    if (!user)
                        return [2 /*return*/, res.status(400).json({ error: { message: "User not found" } })];
                    customer = stripe_2.getOrCreateCustomer(user);
                    _b = (_a = stripe_1.stripe.subscriptions).list;
                    _c = {};
                    return [4 /*yield*/, customer];
                case 2: return [4 /*yield*/, _b.apply(_a, [(_c.customer = (_d.sent()).id,
                            _c)])];
                case 3:
                    subscriptions = _d.sent();
                    return [2 /*return*/, res.json(__assign({}, subscriptions))];
            }
        });
    });
}
exports.listSubscriptions = listSubscriptions;
/**
 * Given the subscriptionId in the body, cancel the subscription
 * @param req
 * @param res
 * @param next
 * @returns Status code
 */
function cancelSubscription(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var deleted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, stripe_1.stripe.subscriptions
                        .del(req.body.subscriptionId)
                        .catch(function (err) { return null; })];
                case 1:
                    deleted = _a.sent();
                    return [2 /*return*/, deleted ? res.send() : res.status(400).send()];
            }
        });
    });
}
exports.cancelSubscription = cancelSubscription;
function getPrices(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var prices, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, stripe_1.stripe.prices.list()];
                case 1:
                    prices = _a.sent();
                    return [2 /*return*/, res.send({ prices: prices })];
                case 2:
                    error_2 = _a.sent();
                    console.log(error_2);
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: { message: "Error retrieving prices" } })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getPrices = getPrices;
/**
 * Given the new priceId and the subscriptionId in the body, update the subscription.
 * @param req
 * @param res
 * @param next
 * @returns Status code
 */
function updateSubscription(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, subscriptionId, priceId, itemId, updated, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, subscriptionId = _a.subscriptionId, priceId = _a.priceId, itemId = _a.itemId;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, stripe_1.stripe.subscriptions.update(subscriptionId, {
                            items: [{ id: itemId, price: priceId }],
                        })];
                case 2:
                    updated = _b.sent();
                    res.send();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _b.sent();
                    console.log(error_3);
                    return [2 /*return*/, res.status(400).json({ error: { message: "Unable to update" } })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.updateSubscription = updateSubscription;

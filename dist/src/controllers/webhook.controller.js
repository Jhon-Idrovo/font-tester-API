"use strict";
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
exports.handleWebHook = void 0;
var stripe_1 = require("../config/stripe");
var Role_1 = __importDefault(require("../models/Role"));
var User_1 = __importDefault(require("../models/User"));
/**
 * We do not run any middleware and the body is parsed as raw.
 * We already have the stripeID on the user.
 */
/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
function handleWebHook(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var event, dataObject, customer, user, _a, userRole, a, guestRole, c;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("---------------------------HANDLING WEBHOOK--------------------------------");
                    try {
                        event = stripe_1.stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
                    }
                    catch (err) {
                        console.log(err);
                        console.log("\u26A0\uFE0F  Webhook signature verification failed.");
                        console.log("\u26A0\uFE0F  Check the env file and enter the correct webhook secret.");
                        return [2 /*return*/, res.sendStatus(400)];
                    }
                    dataObject = event.data.object;
                    console.log(dataObject);
                    return [4 /*yield*/, stripe_1.stripe.customers
                            .retrieve(dataObject.customer)
                            .catch(function (err) { return null; })];
                case 1:
                    customer = (_b.sent());
                    console.log(customer);
                    if (!customer)
                        return [2 /*return*/, res.status(400).json({ error: { message: "No customer found" } })];
                    return [4 /*yield*/, User_1.default.findById(customer.metadata._id).populate("role")];
                case 2:
                    user = _b.sent();
                    if (!user)
                        return [2 /*return*/, res.status(400).json({ error: { message: "No user found" } })];
                    // Handle the event type
                    // Review important events for Billing webhooks
                    // https://stripe.com/docs/billing/webhooks
                    // Remove comment to see the various objects sent for this sample
                    console.log(event.type);
                    _a = event.type;
                    switch (_a) {
                        case "invoice.payment_succeeded": return [3 /*break*/, 3];
                        case "invoice.paid": return [3 /*break*/, 6];
                        case "invoice.payment_failed": return [3 /*break*/, 7];
                        case "customer.subscription.deleted": return [3 /*break*/, 8];
                    }
                    return [3 /*break*/, 11];
                case 3:
                    console.log("--------PAYMENT SUCCEEDED------");
                    // This is trigered also when a recurring payment is made
                    if (user.role.name === "User")
                        return [2 /*return*/, res.send({ received: true })];
                    return [4 /*yield*/, Role_1.default.findOne({ name: "User" }).exec()];
                case 4:
                    userRole = _b.sent();
                    if (!userRole)
                        return [2 /*return*/, res.status(400).json({ error: { message: "Role not found" } })];
                    user.role = userRole._id;
                    user.stripeID = customer.id;
                    return [4 /*yield*/, user.save().catch(function (err) { return null; })];
                case 5:
                    a = _b.sent();
                    if (!a)
                        return [2 /*return*/, res.status(400).json({
                                error: { message: "Error updating the user role and stripeID" },
                            })];
                    return [2 /*return*/, res.send({ received: true })];
                case 6: 
                // Continue to provision the subscription as payments continue to be made.
                // Used to provision services after the trial has ended.
                // The status of the invoice will show up as paid.
                // This is snother way to handle the first payment
                return [3 /*break*/, 12];
                case 7: 
                // HANDLED BY STRIPE. If after 4 retries the payment isn't made,
                // stripe will cancel the supscription and an customer.subscription.deleted
                // event will be issued.
                // If the payment fails or the customer does not have a valid payment method,
                //  an invoice.payment_failed event is sent, the subscription becomes past_due.
                // Use this webhook to notify your user that their payment has
                // failed and to retrieve new card details.
                // console.log("--------PAYMENT FAILED------");
                // //If this is the first time, this is handled on the frontend
                // if (user.stripeID) {
                //   // Recurrent payment failed by 3D secure
                //   if (dataObject.status === "requires_action") {
                //     // Send email notification of why the account was downgraded
                //     // Can this be done from the dashboard?
                //   }
                //   if (dataObject.status === "requires_payment_method") {
                //   }
                // }
                //recurrent payment failed
                // const pastDueRole = await Role.findOne({ name: "User-PastDue" }).exec();
                // if (!pastDueRole)
                //   return res.status(400).json({ error: { message: "Role not found" } });
                // user.role = pastDueRole._id;
                // const b = await user.save().catch(() => null);
                // if (b)
                //   return res
                //     .status(400)
                //     .json({ error: { message: "Error updating the user role" } });
                return [3 /*break*/, 12];
                case 8:
                    console.log("---------------------SUBSCRIPTION DELETED----------------");
                    if (event.request != null) {
                        // handle a subscription cancelled by your request
                        // from above.
                    }
                    else {
                        // handle subscription cancelled automatically based
                        // upon your subscription settings.
                    }
                    return [4 /*yield*/, Role_1.default.findOne({ name: "Guest" }).exec()];
                case 9:
                    guestRole = _b.sent();
                    console.log(guestRole);
                    if (!guestRole)
                        return [2 /*return*/, res
                                .status(400)
                                .json({ error: { message: "Guest role not found" } })];
                    user.role = guestRole._id;
                    return [4 /*yield*/, user.save().catch(function () { return null; })];
                case 10:
                    c = _b.sent();
                    console.log(c);
                    if (!c)
                        return [2 /*return*/, res
                                .status(400)
                                .json({ error: { message: "Error updating the user role" } })];
                    return [3 /*break*/, 12];
                case 11: 
                // Unexpected event type
                return [3 /*break*/, 12];
                case 12:
                    res.sendStatus(200);
                    return [2 /*return*/];
            }
        });
    });
}
exports.handleWebHook = handleWebHook;

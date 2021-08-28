import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/verifyToken";
import * as PayPalCtlr from "../controllers/paypal.controller";

const router = Router();

router.post("/create", PayPalCtlr.createPayment);
router.post("/complete/:orderId", PayPalCtlr.completePayment);

export default router;

import { Router } from "express";
import * as PayPalCtlr from '../controllers/paypal.controller'
import { verifyTokenMiddleware } from "../middlewares/verifyToken";
const router = Router();
router.use(verifyTokenMiddleware)
router.post("/", PayPalCtlr.buyCreditsHandler);
export default router
import { Router } from "express";
import * as SubscriptionCtlr from "../controllers/subscription.controller";
import { verifyTokenMiddleware } from "../middlewares/verifyToken";
const router = Router();
router.get("/plans", SubscriptionCtlr.listPlans);
router.use(verifyTokenMiddleware);
router.post("/cancel", SubscriptionCtlr.cancelSubscription);
router.post("/update", SubscriptionCtlr.updateSubscription);
export default router;

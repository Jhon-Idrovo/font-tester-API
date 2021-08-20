import { Router } from "express";
import * as SubscriptionCtlr from "../controllers/subscription.controller";
import { verifyTokenMiddleware } from "../middlewares/verifyToken";
const router = Router();
router.use(verifyTokenMiddleware);
router.get("/", SubscriptionCtlr.listSubscriptions);
router.post("/create", SubscriptionCtlr.createElementsSubscription);
router.post("/delete", SubscriptionCtlr.cancelSubscription);
export default router;

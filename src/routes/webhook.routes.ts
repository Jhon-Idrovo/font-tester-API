import { Router } from "express";
import { handleWebHook } from "../controllers/webhook.controller";
const router = Router();

router.post("/", handleWebHook);

export default router;

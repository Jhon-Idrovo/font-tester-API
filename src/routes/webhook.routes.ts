import { Router } from "express";
import { handleWebHook } from "../controllers/webhook.controller";m '../controllers/webhook.controller'
const router = Router()

router.post('/webhook', handleWebHook )
import { Router } from "express";
import * as TokenCtlr from "../controllers/token.controller";
const router = Router();

router.post("/new-access-token", TokenCtlr.getAccessTokenHandler);

export default router;

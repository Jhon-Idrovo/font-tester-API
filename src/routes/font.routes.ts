import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/verifyToken";
import * as FontCtlr from "../controllers/font.controller";
const router = Router();

router.use(verifyTokenMiddleware);
router.post("/save", FontCtlr.saveLikedFonts);

export default router;

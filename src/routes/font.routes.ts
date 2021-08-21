import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/verifyToken";
import * as FontCtlr from "../controllers/font.controller";
const router = Router();

router.use(verifyTokenMiddleware);
router.post("/save", FontCtlr.saveLikedFonts);
router.get("/liked", FontCtlr.getLikedFonts);
router.delete("/delete_liked/:match_id", FontCtlr.deleteLikedMatch);
export default router;

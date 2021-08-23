import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/verifyToken";
import * as FontCtlr from "../controllers/font.controller";
const router = Router();

router.use(verifyTokenMiddleware);
router.post("/save-liked", FontCtlr.saveLikedFonts);
router.get("/liked", FontCtlr.getLikedFonts);
router.delete("/delete-liked/:match_id", FontCtlr.deleteLikedMatch);
router.post("/save-disliked", FontCtlr.saveDisliked);
router.get("/disliked", FontCtlr.getDisliked);
router.delete("/delete-disliked/:font_userId", FontCtlr.deleteDisliked);
export default router;

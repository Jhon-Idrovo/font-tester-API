/**
 * endpoints for login and register
 */
import { Router } from "express";
import * as AuthCtlr from "../controllers/auth.controller";

const router = Router();
router.post("/signin", AuthCtlr.signInHandler); //the access token is send here
router.post("/get-new-access-token", AuthCtlr.getAccessTokenHandler);
router.post("/signup", AuthCtlr.signUpHandler);
router.post("/signout", AuthCtlr.signOutHandler);
router.post("/create-admin", AuthCtlr.createAdminHandler);

export default router;

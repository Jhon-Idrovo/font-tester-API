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
//sign in with Google
//scopes https://developers.google.com/identity/protocols/oauth2/scopes?authuser=1#google-sign-in
router.get("/google", AuthCtlr.handleGoogle);
//sign in with facebook
router.get("/facebook", AuthCtlr.handleFacebook);
//sign in with twitter
router.get("/twitter", AuthCtlr.handleTwitter);
export default router;

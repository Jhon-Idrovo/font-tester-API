/**
 * endpoints for login and register
 */
import { Router } from "express";
import passport from "passport";
import * as AuthCtlr from "../controllers/auth.controller";
import { verifyTokenMiddleware } from "../middlewares/verifyToken";

const router = Router();
router.post("/signin", AuthCtlr.signInHandler); //the access token is send here
router.post("/signup", AuthCtlr.signUpHandler);
router.post("/create-admin", AuthCtlr.createAdminHandler);
//sign in with Google
//scopes https://developers.google.com/identity/protocols/oauth2/scopes?authuser=1#google-sign-in
router.get("/google", AuthCtlr.handleGoogle);
//sign in with facebook
router.get("/facebook", passport.authenticate("facebook"));
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false, scope: "email" }),
  AuthCtlr.handleFacebook
);
//sign in with twitter
router.get("/twitter", passport.authenticate("twitter", { session: false }));
router.get(
  "/twitter/callback",
  passport.authenticate("twitter", { session: false }),
  AuthCtlr.handleTwitter
);
router.use(verifyTokenMiddleware);
router.post("/signout", AuthCtlr.signOutHandler);
router.post("/change-password", AuthCtlr.changePassword);
router.post("/delete-user", AuthCtlr.deleteUser);
export default router;

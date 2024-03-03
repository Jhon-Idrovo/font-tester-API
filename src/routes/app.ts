/**
 * express app configuration
 */
import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";

import authRouter from "./auth.routes";
import tokenRouter from "./token.routes";
import userRouter from "./user.routes";
import fontRouter from "./font.routes";
import creditRouter from "./paypal.routes";
import { basePath } from "../config/config";
import passport from "passport";

const app = express();
//use JSON for non-webhook routes
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("ORIGINAL URL:", req.originalUrl);

  return req.originalUrl === "/api/v3/webhook"
    ? express.raw({ type: "application/json" })(req, res, next)
    : express.json()(req, res, next);
});
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://fonttester-413418.uc.r.appspot.com",
  })
);
app.use(morgan("dev"));
//sessions
app.use(
  session({ secret: "la-vaca-lola", resave: false, saveUninitialized: false })
);
//initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use(`${basePath}/auth`, authRouter);
app.use(`${basePath}/tokens`, tokenRouter);
app.use(`${basePath}/users`, userRouter);
app.use(`${basePath}/fonts`, fontRouter);
app.use(`${basePath}/credits`, creditRouter);

//handle wrong paths
app.use("*", (req: Request, res: Response) =>
  res.status(404).json({ error: "Page not found" })
);

export default app;

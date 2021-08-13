/**
 * express app configuration
 */
import express, { Response, Request } from "express";
import cors from "cors";
import morgan from "morgan";

import authRouter from "./auth.routes";
import productRouter from "./products.routes";
import userRouter from "./user.routes";
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
//base URL. Standard form
const version = 3;
const basePath = `/api/v${version}`;
app.use(`${basePath}/auth`, authRouter);
app.use(`${basePath}/users`, userRouter);
app.use(`${basePath}/products`, productRouter);
//handle wrong paths
app.use("*", (req: Request, res: Response) =>
  res.status(404).json({ error: "Page not found" })
);

export default app;

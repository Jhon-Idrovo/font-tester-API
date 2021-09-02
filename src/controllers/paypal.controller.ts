import { NextFunction, Request, Response } from "express";
import { RequestEnhanced } from "../interfaces/utils";
import User from "../models/User";
import { modifyCredit } from "../utils/users";

export async function buyCreditsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userID } = (req as RequestEnhanced).decodedToken;
  const { credits } = req.body;
  const user = await User.findById(userID);
  if (!user) return res.status(400).json({ error: "User not found" });
  try {
    modifyCredit(user, +credits);
    return res.send();
  } catch (error) {
    return res.status(400).json({ error: "Credit change culdn't be made" });
  }
}

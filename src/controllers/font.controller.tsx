import { NextFunction, Request, Response } from "express";
import { IFont } from "../interfaces/fonts";
import { RequestEnhanced } from "../interfaces/utils";
import Font from "../models/Font";
import User from "../models/User";
import { findOrCreateFont } from "../utils/fonts";

/**
 * Given a list of list of matching fonts, save the list to the
 * database
 * @param req
 * @param res
 * @param next
 */
export async function saveLikedFonts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userID } = (req as RequestEnhanced).decodedToken;
  // Retrieve user
  const user = await User.findById(userID);
  if (!user)
    return res.status(400).json({ error: { message: "User not found" } });
  const { likedFonts }: { likedFonts: IFont[][] } = req.body;
  try {
    // Find or create all involucred fonts on one asynchronous step
    const fontsPromises = likedFonts.map((matchingFonts) =>
      Promise.all(
        matchingFonts.map((fontObj) =>
          findOrCreateFont(fontObj.family, fontObj.category)
        )
      )
    );
    const fonts = await Promise.all(fontsPromises);
    console.log(fonts);

    // Attach the fonts and the user with the Font_User model
    return res.send();
  } catch (error) {
    console.log(error);

    return res.status(400).json({ error: { message: error.message } });
  }
}

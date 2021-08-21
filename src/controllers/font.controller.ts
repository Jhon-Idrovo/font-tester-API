import { NextFunction, Request, Response } from "express";
import { IFont } from "../interfaces/fonts";
import { RequestEnhanced } from "../interfaces/utils";
import Font from "../models/Font";
import Fonts_User_Liked from "../models/Fonts_User_Liked";
import User from "../models/User";
import { findOrCreateFont } from "../utils/fonts";

/**
 * Given a list of list of matching object fonts, save the list to the
 * database using a relation Fonts_User
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
  // Update: We do not need the user since we only need its id,
  // which is in the token
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
    const fonts_userPromises = fonts.map((matchingFonts) =>
      Fonts_User_Liked.create({
        fonts_ids: matchingFonts.map((fontObj) => fontObj._id),
        user_id: userID,
      })
    );
    const r = await Promise.all(fonts_userPromises);
    return res.send();
  } catch (error) {
    console.log(error);

    return res.status(400).json({ error: { message: error.message } });
  }
}
/**
 * Using the userID from the token, retieve the Fonts_User_Liked
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function getLikedFonts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userID } = (req as RequestEnhanced).decodedToken;
  try {
    const liked = await Fonts_User_Liked.find({ user_id: userID })
      .populate("fonts_ids", "family category")
      .exec();
    res.json({ likedFonts: liked });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: { message: "Sorry we can't find the fonts. Try again." },
    });
  }
}
/**
 * Deletes a match (group of fonts) from the Fonts_User_Liked collection
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function deleteLikedMatch(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { match_id } = req.params;
  const deleted = await Fonts_User_Liked.findByIdAndDelete(match_id).exec();
  return deleted
    ? res.send()
    : res.status(400).json({ error: { message: "Error deleting the match" } });
}

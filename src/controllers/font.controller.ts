import { NextFunction, Request, Response } from "express";
import { IFont } from "../interfaces/fonts";
import { RequestEnhanced } from "../interfaces/utils";
import Font from "../models/Font";
import Fonts_User_Liked from "../models/Fonts_User_Liked";
import Font_User_Disliked from "../models/Font_User_Disliked";
import User from "../models/User";
import { findOrCreateFont } from "../utils/fonts";
import { consumeCredit } from "../utils/users";

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
  const {
    likedFonts,
    creditAmount,
  }: { likedFonts: IFont[][]; creditAmount: number } = req.body;
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
    const user = await User.findById(userID);
    if (!user)
      return res.status(400).json({ error: { message: "User not found" } });
    await consumeCredit(user, 1);
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
export async function getDisliked(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userID } = (req as RequestEnhanced).decodedToken;
  const dislikedFonts = await Font_User_Disliked.find({ user_id: userID })
    .populate("font_id")
    .exec();
  res.json({ dislikedFonts });
}
export async function saveDisliked(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userID } = (req as RequestEnhanced).decodedToken;
  const { family, category } = req.body.dislikedFont;
  const font = await findOrCreateFont(family, category);
  try {
    // Search if it's already saved
    const f = await Font_User_Disliked.findOne({
      font_id: font._id,
      user_id: userID,
    }).exec();
    if (f) return res.send();
    const newDoc = await Font_User_Disliked.create({
      font_id: font._id,
      user_id: userID,
    });
    return res.send();
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ error: { message: "Error saving to the database" } });
  }
}
export async function deleteDisliked(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userID } = (req as RequestEnhanced).decodedToken;
  const deleted = await Font_User_Disliked.findByIdAndDelete(
    req.params.font_userId
  );
  return deleted
    ? res.send()
    : res.status(400).json({ error: { message: "Error deleting the record" } });
}

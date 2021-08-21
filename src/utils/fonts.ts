import { IFont } from "../interfaces/fonts";
import Font from "../models/Font";

export async function findOrCreateFont(
  family: IFont["family"],
  category: IFont["category"]
) {
  let font = await Font.findOne({ family });
  if (!font) font = await Font.create({ family, category });
  return font;
}

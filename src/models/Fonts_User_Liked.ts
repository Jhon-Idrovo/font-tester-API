import { model, Schema } from "mongoose";
import { IFonts_User_Liked } from "../interfaces/fonts_user_liked";

const fonts_userSchema = new Schema<IFonts_User_Liked>({
  fonts_ids: [{ ref: "Font", type: Schema.Types.ObjectId, require: true }],
  user_id: { ref: "User", type: Schema.Types.ObjectId, require: true },
});

export default model<IFonts_User_Liked>("Fonts_User_Liked", fonts_userSchema);

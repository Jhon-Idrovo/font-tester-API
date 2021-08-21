import { model, Schema } from "mongoose";
import { IFonts_User } from "../interfaces/fonts_user";

const fonts_userSchema = new Schema<IFonts_User>({
  fonts_ids: [{ ref: "Font", type: Schema.Types.ObjectId, require: true }],
  user_id: { ref: "User", type: Schema.Types.ObjectId, require: true },
});

export default model<IFonts_User>("Fonts_User", fonts_userSchema);

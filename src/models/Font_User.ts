import { Schema } from "mongoose";
import { IFont_User } from "../interfaces/font_user";

const font_userSchema = new Schema<IFont_User>({
  fonts_ids: [{ ref: "Font", type: Schema.Types.ObjectId, require: true }],
  user_id: { ref: "Font", type: Schema.Types.ObjectId, require: true },
});

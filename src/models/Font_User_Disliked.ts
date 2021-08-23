import { model, Schema } from "mongoose";
import { IFont_User_Disliked } from "../interfaces/font_user_disliked";

const dislikedFontsSchema = new Schema<IFont_User_Disliked>({
  user_id: { ref: "User", type: Schema.Types.ObjectId },
  font_id: { ref: "Font", type: Schema.Types.ObjectId },
});

export default model<IFont_User_Disliked>(
  "Font_User_Disliked",
  dislikedFontsSchema
);

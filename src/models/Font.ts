import { model, Schema } from "mongoose";
import { IFont } from "../interfaces/fonts";

const fontSchema = new Schema<IFont>({
  family: { type: String, require: true, unique: true },
  category: String,
});

export default model<IFont>("Font", fontSchema);

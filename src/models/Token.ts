import { model, Schema, Types } from "mongoose";
import { BlacklistedTokenInterface } from "./interfaces/token";

const blacklistedTokenSchema = new Schema<BlacklistedTokenInterface>({
  token: String,
  //this could be a reference either
  //if unique, the user wouldn't be able to login in multiple devices
  userID: { type: Types.ObjectId, unique: false },
});

export default model<BlacklistedTokenInterface>(
  "BlacklistedToken",
  blacklistedTokenSchema
);

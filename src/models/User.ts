import { model, Schema } from "mongoose";
import { UserIfc, UserModel } from "../interfaces/users";
import bcrypt from "bcryptjs";
const userSchema = new Schema<UserIfc, UserModel>({
  authMethod: String,
  authProviderId: { type: String, require: false },
  username: { type: String, required: true, unique: false },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { ref: "Role", type: Schema.Types.ObjectId, require: true },
  likedFonts: { ref: "Font", type: Schema.Types.ObjectId },
  unlikedFonts: { ref: "Font", type: Schema.Types.ObjectId },
  subscriptionId: { type: String, require: false, unique: true },
});

/**
 *
 * @param password string with the password to be assigned
 * @returns string promise that resolves to an encrypted password
 */
userSchema.statics.encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  const encryptedPassword = bcrypt.hash(password, salt);
  return encryptedPassword;
};

/**
 *
 * @param savedPassword password saved in the db
 * @param tipedPassword password senden fron the client
 * @returns true if the passwords are the same, otherwise, false
 */
userSchema.methods.comparePassword = async (
  savedPassword: string,
  tipedPassword: string
) => {
  return await bcrypt.compare(tipedPassword, savedPassword);
};

export default model<UserIfc, UserModel>("User", userSchema);

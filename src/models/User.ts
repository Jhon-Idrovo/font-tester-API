import { model, Schema } from "mongoose";
import { UserIfc, UserModel } from "./interfaces/users";
import bcrypt from "bcryptjs";
const userSchema = new Schema<UserIfc, UserModel>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  roles: [{ ref: "Role", type: Schema.Types.ObjectId }],
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

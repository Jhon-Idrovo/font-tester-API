import { Document } from "mongoose";
import { UserIfc } from "../interfaces/users";
import Role from "../models/Role";
import User from "../models/User";

export async function getOrCreateUser(
  email: string,
  username: string,
  authMethod: string,
  password: string,
  authProviderId?: string
) {
  let user = await User.findOne({ email }).exec();
  if (!user) {
    const role = await Role.findOne({ name: "User" });
    user = await User.create({
      email,
      username,
      role,
      authMethod,
      // to avoid duplicate key error
      credits: 10,
      password: await User.encryptPassword(password),
      authProviderId,
    });
  }
  return user;
}
/**
 * Substracts the given consumeAmount from the user's credits.
 * @param user
 * @param consumeAmount
 * @returns Promise that throws an error if the change couldn't be made.
 */
export async function consumeCredit(
  user: UserIfc & Document<any, any, UserIfc>,
  consumeAmount: number
) {
  user.credits = user.credits - consumeAmount;
  return user.save();
}

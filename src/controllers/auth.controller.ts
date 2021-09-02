/**
 * logic for handling auth requests
 */

import { NextFunction, Request, Response } from "express";
import Role from "../models/Role";
import User from "../models/User";
import BlacklistedToken from "../models/BlacklistedToken";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/tokens";
import passport from "passport";
import { UserIfc } from "../interfaces/users";
import { Document } from "mongoose";
import { clientDomainPath } from "../config/config";
import { RequestEnhanced, ResponseError } from "../interfaces/utils";

/**
 * Verifies username and password against the database. If good, returns an object
 * with an access token and refresh token. The user role are send in the payload of the
 * access token. The role need to be decrypted only on the server because we can't share
 * the decoding secret safely with the client.
 * @param req
 * @param res
 * @param next
 */
export async function signInHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("----------------------SIGN IN--------------------------------");

  try {
    //use email because the username is not unique when using OAuth providers
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("role").exec();
    if (user) {
      console.log(user);

      //compare passwords
      if (await user.comparePassword(user.password, password)) {
        const userRole = user.role.name;

        const refreshToken = generateRefreshToken(
          user._id,
          userRole,
          user.email,
          user.username,
          user.credits
        );
        return res.status(200).json({
          accessToken: generateAccessToken(
            user._id,
            userRole,
            user.email,
            user.username,
            user.credits
          ),
          refreshToken,
          //this is optional, you should not rely on this to grant access to any
          //protected resorce on the client because it's easy to modify.
          //And we can't very the signature on the client.
          //Instead, use the access token payload on the server.
          //role: userRole,
        });
      } else {
        return res
          .status(400)
          .json({ error: { message: "Invalid password" }, token: null });
      }
    }
    return res.status(400).json({ error: { message: "User not found" } });
  } catch (error) {
    return res
      .status(400)
      .json({ error: { message: (error as Error).message } });
  }
}

/**
 * Deletes the refresh token from the database and invalidates the access token.
 * This method is optional since deleting the tokens on the client logs out
 * succesfully. This method is more needed when someone steals a refresh token.
 * In this case, the user should request the log out througth this method.
 * @param req
 * @param res
 * @param next
 */
export async function signOutHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const refreshToken = req.headers.authorization;
  const payload = refreshToken ? verifyToken(refreshToken as string) : null;
  try {
    if (payload) {
      //blacklist the refresh token
      const newBlacklistedTkn = await new BlacklistedToken({
        token: refreshToken,
        userID: payload.userID,
      }).save();
      return res.status(200);
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
  return res.status(400).json({ error: "Invalid refresh token" });
}

/**
 * Given a username, email and password, creates a new user assgining it a 'User' role
 * returns a jwt to the server or an error
 * @param req
 * @param res
 * @param next
 */
export async function signUpHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username, password, email } = req.body;
  try {
    //we could hardcode the role's id but if it gets deleted/modified we would have a problem
    //use "Guest" until the payment is made
    const userRole = await Role.findOne({ name: "User" });
    const user = await new User({
      username,
      email,
      password: await User.encryptPassword(password),
      // to avoid
      credits: 10,
      role: userRole?._id,
    }).save();
    await user.populate("role", "name -_id").execPopulate();
    const newRole = user.role.name;
    const refreshToken = generateRefreshToken(
      user._id,
      newRole,
      user.email,
      user.username,
      user.credits
    );
    return res.status(201).json({
      accessToken: generateAccessToken(
        user._id,
        newRole,
        user.email,
        user.username,
        user.credits
      ),
      refreshToken,
      user,
    });
  } catch (error) {
    console.log("Error on signup process:", error);

    //determine the error
    let errContent = { message: "" };
    switch (error.name) {
      case "MongoError":
        switch (error.code) {
          case 11000: //generally error 11000 is caused by existing records
            //since there is only one unique field on User we can assume it's the cause
            errContent = {
              message:
                "There already exists an account associated to this email",
            };
            break;

          default:
            errContent = {
              message:
                "An unidentified error happened. We are workin to solve it as soon as possible",
            };
            break;
        }
        break;
      //normal node error
      default:
        break;
    }
    return res.status(400).json({ error: errContent });
  }
}

/**
 * Given the email, username, password and correct admin access password,
 * it creates a new user with a role of "Admin"
 * Then, it sends back to the client a jwt token.
 * @param req
 * @param res
 * @param next
 */
export async function createAdminHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, password, email, adminAccessPassword } = req.body;
    if (adminAccessPassword === process.env.CREATE_ADMIN_PASSWORD) {
      const adminRole = await Role.findOne({ name: "Admin" });
      const admin = await new User({
        username,
        email,
        //we don't need the await in this call but an error detects it as promise even if it is not
        password: await User.encryptPassword(password),
        role: adminRole?._id,
      }).save();

      return res.status(201).json({
        accessToken: generateAccessToken(
          admin._id,
          "Admin",
          admin.email,
          admin.email,
          admin.credits
        ),
      });
    }
    res.json({ error: "Admin access password invalid" });
  } catch (error) {
    return res.status(400).json({ error });
  }
}

/**
 * This is excuted before the passport strategy handler, which
 * recieves the user data and fetches/creates the user. Then that user
 * is passed to this function with the roles populated.
 * @param req
 * @param res
 * @param next
 */
export async function handleGoogle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("here");

  passport.authenticate(
    "google",
    { scope: ["profile", "email"], session: false },
    function (err, user: UserIfc & Document<any, any, UserIfc>, userInfo) {
      console.log(err, user, userInfo);
      //roles are populated
      const role = user.role.name;
      const accesToken = generateAccessToken(
        user._id,
        role,
        user.email,
        user.username,
        user.credits
      );
      const refreshToken = generateRefreshToken(
        user._id,
        role,
        user.email,
        user.username,
        user.credits
      );
      console.log("redirecting", refreshToken);

      if (role === "Guest") {
        //redirect to complete signup
        return res.redirect(
          `${clientDomainPath}/signup?at=${accesToken}&rt=${refreshToken}`
        );
      }
      return res.redirect(
        `${clientDomainPath}/?at=${accesToken}&rt=${refreshToken}`
      );
    }
  )(req, res, next);
}

export async function handleFacebook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("handleFacebook REQUEST:------------------");
  const user = req.user as UserIfc & Document<any, any, UserIfc>;
  //roles are populated
  const role = user.role.name;
  const accesToken = generateAccessToken(
    user._id,
    role,
    user.email,
    user.username,
    user.credits
  );
  const refreshToken = generateRefreshToken(
    user._id,
    role,
    user.email,
    user.username,
    user.credits
  );
  console.log("redirecting");
  if (role === "Guest") {
    //redirect to complete signup
    return res.redirect(
      `${clientDomainPath}/signup?at=${accesToken}&rt=${refreshToken}`
    );
  }
  return res.redirect(
    `${clientDomainPath}/?at=${accesToken}&rt=${refreshToken}`
  );
}
export async function handleTwitter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("handleTwitter", req.user);
  const user = req.user as UserIfc & Document<any, any, UserIfc>;
  //roles are populated
  const role = user.role.name;
  const accesToken = generateAccessToken(
    user._id,
    role,
    user.email,
    user.username,
    user.credits
  );
  const refreshToken = generateRefreshToken(
    user._id,
    role,
    user.email,
    user.username,
    user.credits
  );
  console.log("redirecting", clientDomainPath);
  if (role === "Guest") {
    //redirect to complete signup
    return res.redirect(
      `${clientDomainPath}/signup?at=${accesToken}&rt=${refreshToken}`
    );
  }
  return res.redirect(
    `${clientDomainPath}/?at=${accesToken}&rt=${refreshToken}`
  );
}
/**
 *
 * @param req
 * @param res
 * @param next
 */
export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userID } = (req as RequestEnhanced).decodedToken;
  const { newPassword } = req.body;
  const user = await User.findById(userID);
  if (!user)
    return res.status(400).json({ error: { message: "User not found" } });
  user.password = await User.encryptPassword(newPassword);
  try {
    await user.save();
    return res.send();
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      error: { message: "Unable to update", completeError: error },
    } as ResponseError);
  }
}
/**
 *
 * @param req
 * @param res
 * @param next
 */
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userID } = (req as RequestEnhanced).decodedToken;
  try {
    const user = await User.findById(userID);
    if (!user)
      return res.status(400).json({ error: { message: "User not found" } });
    await user.delete();
    res.send();
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      error: { message: "Unable to update", completeError: error },
    } as ResponseError);
  }
}

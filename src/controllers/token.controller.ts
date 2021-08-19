import { NextFunction, Response, Request } from "express";
import BlacklistedToken from "../models/BlacklistedToken";
import User from "../models/User";
import router from "../routes/auth.routes";
import { generateAccessToken, verifyToken } from "../utils/tokens";
/**
 * This is a separate file since we can't use the same
 * verifyTokenMiddleware used for other requests
 */
/**
 * Takes in a refresh token and sends back a new access token if the
 * first is valid.
 * @param req
 * @param res
 * @param next
 */
export async function getAccessTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const refreshToken = req.body.refreshToken;
  if (refreshToken) {
    //validate the refresh token
    //first validation
    const decoded = verifyToken(refreshToken as string);

    if (decoded) {
      //second validation: See if the token is blacklisted
      const dbToken = await BlacklistedToken.findOne({
        token: refreshToken as string,
      }).catch(() => null);
      /**a third validation could be neccesary to verify that the user requesting the
       * new token is the same as the user registered in it. This is important since
       * the autorization middleware uses that information to identify the user.
       * A user cannot use its refresh token to request an access token for another
       * client since we return the latter with the same userID.
       */
      if (!dbToken) {
        //send another acces token to the client
        const user = await User.findById(decoded.userID);
        if (!user)
          return res.status(400).json({ error: { message: "User not found" } });
        await user.populate("role").execPopulate();
        return res.status(200).json({
          accessToken: generateAccessToken(
            user._id,
            user.role.name,
            user.email,
            user.username
          ),
        });
      }
    }
    //the token is expired or blacklisted
    return res
      .status(401)
      .json({ error: { message: "Invalid refresh token" } });
  }
  //no refresh token
  return res.status(401).json({ error: { message: "No refresh token" } });
}

export default router;

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as TwitterStrategy } from "passport-twitter";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../models/User";
import { basePath } from "./config";
import mongoose from "mongoose";
import Role from "../models/Role";

export const googleRedirectUrl = `${basePath}/auth/google`;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: googleRedirectUrl,
    },
    async function (
      accessToken: string,
      refreshToken: string,
      userInfo,
      cb: Function
    ) {
      console.log("user info: ", userInfo);
      const role = await Role.findOne({ name: "User" });
      const { id, displayName, email, picture } = userInfo;
      //we cannot user the id for generating an ObjectId because
      //ObjectId(id) it generates a new one each time.
      //both fields are unique
      const user = await User.findOne({ email, username: displayName })
        .populate("roles", "name")
        .exec();
      //user already exists
      if (user) {
        console.log("user found", user);

        return cb(null, user);
      }
      //create new user
      try {
        const newUser = await User.create({
          username: displayName,
          password: "empty",
          authMethod: "google",
          email,
          roles: role?._id,
        });
        //populate to avoid refetching on the next function
        newUser.populate("roles", "name");
        return cb(null, newUser);
      } catch (error) {
        console.log(error);

        return cb(error, null);
      }
    }
  )
);
export const facebookCbURL = `${basePath}/auth/facebook`;
passport.use(
  new FacebookStrategy(
    {
      callbackURL: facebookCbURL,
      clientID: process.env.FACEBOOK_APP_ID as string,
      clientSecret: process.env.FACEBOOK_APP_SECRET as string,
      //https://developers.facebook.com/docs/graph-api/reference/v2.5/user
      profileFields: ["id", "name", "picture", "email"],
    },
    async function (
      accessToken: string,
      refreshToken: string,
      userInfo,
      cb: Function
    ) {
      console.log("user info: ", userInfo);
      const role = await Role.findOne({ name: "User" });
    }
  )
);

export const twitterCbURL = `${basePath}/auth/twitter`;
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_API_KEY as string,
      consumerSecret: process.env.TWITTER_API_SECRET as string,
      callbackURL: twitterCbURL,
    },
    function (token, tokenSecret, profile, cb) {
      console.log(profile);
    }
  )
);
console.log("Passport initialized");

// passport.use(
//   new Strategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//       authorizationURL: "https://www.example.com/oauth2/authorize",
//       tokenURL: "https://www.example.com/oauth2/token",
//       callbackURL: "http://localhost:3000/auth/example/callback",
//     },
//     async (
//       accessToken: string,
//       refreshToken: string,
//       profile,
//       cb: Function
//     ) => {
//       console.log(profile);
//       const { id, displayName } = profile;
//       const user = await User.findById(profile.id);
//       if (user) return user;
//       const newUser = User.create({
//         username: displayName,
//         //this needs to be an ObjectId instance?
//         _id: id,
//         password: "",
//         authMethod: "google",
//         email: "",
//         roles: "",
//       });
//     }
//   )
// );

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as TwitterStrategy } from "passport-twitter";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { getOrCreateUser } from "../utils/users";

export const googleRedirectUrl = `https://font-tester-api.herokuapp.com/api/v3/auth/google`;
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
      const { id, displayName, email, picture } = userInfo;
      //we cannot use the id for generating an ObjectId because
      //ObjectId(id) it generates a new one each time.
      //email is unique
      try {
        const user = await getOrCreateUser(
          email,
          displayName,
          "google",
          "empty",
          id
        );

        //populate to avoid refetching on the next function
        await user.populate("role", "name").execPopulate();
        return cb(null, user);
      } catch (error) {
        console.log(error);

        return cb(error, null);
      }
    }
  )
);
export const facebookCbURL = `https://font-tester-api.herokuapp.com/api/v3/auth/facebook/callback`;
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
      console.log("on passport strategy, user info: ", userInfo);
      // get the user
      //const user = getOrCreateUser()
      const { displayName, id, emails } = userInfo;
      try {
        if (!emails)
          return cb(
            new Error("User doesn't have an email associated with its account")
          );
        const user = await getOrCreateUser(
          emails[0].value,
          displayName,
          "facebook",
          "facebook",
          id
        );
        return cb(null, user);
      } catch (error) {
        console.log(error);
        return cb(error, null);
      }
    }
  )
);

export const twitterCbURL = `https://font-tester-api.herokuapp.com/api/v3/auth/twitter/callback`;
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_API_KEY as string,
      consumerSecret: process.env.TWITTER_API_SECRET as string,
      callbackURL: twitterCbURL,
      includeEmail: true,
    },
    async function (token, tokenSecret, profile, cb) {
      console.log("on passport. Profile:", profile);
      const { displayName, emails, id } = profile;
      try {
        if (!emails)
          return cb(
            new Error("User doesn't have an email associated with its account"),
            null
          );
        const user = await getOrCreateUser(
          emails[0].value,
          displayName,
          "twitter",
          "twitter",
          id
        );
        //populate user
        await user.populate("role").execPopulate();
        return cb(null, user);
      } catch (error) {
        console.log(error);
        return cb(error, null);
      }
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

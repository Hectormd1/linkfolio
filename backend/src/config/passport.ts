import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { Strategy as GitHubStrategy } from "passport-github2"
import User from "../models/User"
import slug from "slug"

console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID)
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET)
console.log("GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL)
console.log("GITHUB_CLIENT_ID:", process.env.GITHUB_CLIENT_ID)
console.log("GITHUB_CLIENT_SECRET:", process.env.GITHUB_CLIENT_SECRET)
console.log("GITHUB_CALLBACK_URL:", process.env.GITHUB_CALLBACK_URL)

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google callback profile:", profile)
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          const email = profile.emails?.[0]?.value || await generateFakeEmail();
          const handle = await generateUniqueHandle(email, profile.displayName);
          user = await User.create({
            googleId: profile.id,
            email,
            handle,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value,
          });
        }
        done(null, user)
      } catch (error) {
        console.error("Error en GoogleStrategy:", error)
        done(error)
      }
    }
  )
)

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("GitHub callback profile:", profile)
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
          const email = profile.emails?.[0]?.value || await generateFakeEmail();
          const handle = await generateUniqueHandle(email, profile.username);
          user = await User.create({
            githubId: profile.id,
            email,
            handle,
            name: profile.displayName || profile.username,
            avatar: profile.photos?.[0]?.value,
          });
        }
        done(null, user)
      } catch (error) {
        console.error("Error en GitHubStrategy:", error)
        done(error)
      }
    }
  )
)

async function generateFakeEmail() {
  let base = "usuario"
  let domain = "correo.com"
  let email = `${base}@${domain}`
  let counter = 1
  while (await User.findOne({ email })) {
    email = `${base}${counter}@${domain}`
    counter++
  }
  return email
}

async function generateUniqueHandle(email?: string, username?: string) {
  let baseHandle = "usuario"
  if (username) {
    baseHandle = slug(username, "")
  } else if (email) {
    baseHandle = slug(email.split("@")[0], "")
  }
  let handle = baseHandle
  let counter = 1
  while (await User.findOne({ handle })) {
    handle = `${baseHandle}${counter}`
    counter++
  }
  return handle
}

export default passport
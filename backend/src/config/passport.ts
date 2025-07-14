import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { Strategy as GitHubStrategy } from "passport-github2"
import User from "../models/User"
import slug from "slug"

interface GoogleProfile {
  id: string
  displayName?: string
  emails?: { value: string }[]
  photos?: { value: string }[]
}

interface GoogleVerifyCallback {
  (
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: (error: any, user?: any) => void
  ): Promise<void>
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    (async (
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done: (error: any, user?: any) => void
    ): Promise<void> => {
      const email = profile.emails?.[0]?.value
      let user = await User.findOne({ email })
      if (!user) {
        const handle = await generateUniqueHandle(email)
        user = await User.create({
          name: profile.displayName,
          email,
          handle,
          password: "google-oauth", // Diferenciar origen
          description: "",
          image: profile.photos?.[0]?.value || "",
          links: "[]",
        })
      }
      return done(null, user)
    }) as GoogleVerifyCallback
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

interface GitHubProfile {
  id: string
  displayName?: string
  username?: string
  emails?: { value: string }[]
  photos?: { value: string }[]
}

interface GitHubVerifyCallback {
  (
    accessToken: string,
    refreshToken: string,
    profile: GitHubProfile,
    done: (error: any, user?: any) => void
  ): Promise<void>
}

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      let email = profile.emails?.[0]?.value
      if (!email) {
        email = await generateFakeEmail()
      }
      let user = await User.findOne({ email })
      if (!user) {
        const handle = await generateUniqueHandle(email, profile.username)
        user = await User.create({
          name: profile.displayName || profile.username,
          email,
          handle, // ahora el handle será el username si existe
          password: "github-oauth",
          description: "",
          image: profile.photos?.[0]?.value || "",
          links: "[]",
        })
      }
      return done(null, user)
    }
  )
)

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
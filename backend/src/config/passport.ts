import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { Strategy as DiscordStrategy } from 'passport-discord'

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  callbackURL: `${process.env.OAUTH_CALLBACK_URL}/oauth/github/callback`
}, (_accessToken: any, _refreshToken: any, profile: { id: any; username: any; emails: { value: any }[] }, done: (arg0: null, arg1: { provider: string; id: any; username: any; email: any }) => void) => {
  const user = {
    provider: 'github',
    id: profile.id,
    username: profile.username,
    email: profile.emails?.[0]?.value || '',
  }
  done(null, user)
}))

// Discord Strategy
passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID!,
  clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  callbackURL: `${process.env.OAUTH_CALLBACK_URL}/oauth/discord/callback`,
  scope: ['identify', 'email']
}, (_accessToken, _refreshToken, profile, done) => {
  const user = {
    provider: 'discord',
    id: profile.id,
    username: profile.username,
    email: profile.email,
  }
  done(null, user)
}))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((obj: any, done) => {
  done(null, obj)
})

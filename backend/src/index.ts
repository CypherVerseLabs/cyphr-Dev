// src/oauthServer.ts or server.ts

import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

// ─── Session Middleware ─────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set true if using HTTPS
    httpOnly: true,
    sameSite: 'lax',
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// ─── Serialize / Deserialize ───────────────────────
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: any, done) => {
  const user = await findUserById(id);
  done(null, user);
});

// ─── GitHub Strategy ───────────────────────────────
passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: `${process.env.BACKEND_BASE_URL}/api/auth/github/callback`,
  },
  async (_accessToken: any, _refreshToken: any, profile: any, done: (arg0: null, arg1: { id: string; username: any; }) => any) => {
    const user = await findOrCreateUserFromProfile(profile, 'github');
    return done(null, user);
  }
));

// ─── Discord Strategy ──────────────────────────────
passport.use(new DiscordStrategy(
  {
    clientID: process.env.DISCORD_CLIENT_ID!,
    clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    callbackURL: `${process.env.BACKEND_BASE_URL}/api/auth/discord/callback`,
    scope: ['identify', 'email'],
  },
  async (_accessToken, _refreshToken, profile, done) => {
    const user = await findOrCreateUserFromProfile(profile, 'discord');
    return done(null, user);
  }
));

// ─── Twitter Strategy ──────────────────────────────
passport.use(new TwitterStrategy(
  {
    consumerKey: process.env.TWITTER_CLIENT_ID!,
    consumerSecret: process.env.TWITTER_CLIENT_SECRET!,
    callbackURL: `${process.env.BACKEND_BASE_URL}/api/auth/twitter/callback`,
    includeEmail: true,
  },
  async (_token, _tokenSecret, profile, done) => {
    const user = await findOrCreateUserFromProfile(profile, 'twitter');
    return done(null, user);
  }
));

// ─── Routes ────────────────────────────────────────

// GitHub
app.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/api/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (_req, res) => res.redirect('/api/auth/oauth/success?provider=github')
);

// Discord
app.get('/api/auth/discord', passport.authenticate('discord'));

app.get('/api/auth/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/login' }),
  (_req, res) => res.redirect('/api/auth/oauth/success?provider=discord')
);

// OAuth success - sends JWT to frontend via popup or redirect
app.get('/api/auth/oauth/success', (req, res) => {
  if (!req.user) {
    return res.redirect(`${process.env.FRONTEND_ORIGIN}/login?error=OAuth failed`);
  }

  const token = jwt.sign(req.user as any, process.env.JWT_SECRET!, { expiresIn: '7d' });
  const provider = req.query.provider || 'oauth';

  res.send(`
    <script>
      if (window.opener) {
        window.opener.postMessage({
          provider: "${provider}",
          token: "${token}"
        }, "${process.env.FRONTEND_ORIGIN}");
        window.close();
      } else {
        window.location = "${process.env.FRONTEND_ORIGIN}/oauth/callback?token=${token}";
      }
    </script>
  `);
});

// Twitter
app.get('/api/auth/twitter', passport.authenticate('twitter'));

app.get('/api/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  (_req, res) => res.redirect('/api/auth/oauth/success?provider=twitter')
);

// ─── Placeholder DB Logic ───────────────────────────
async function findOrCreateUserFromProfile(profile: any, provider: string) {
  return {
    id: `${provider}_${profile.id}`,
    username: profile.username || profile.displayName || 'unknown',
  };
}

async function findUserById(id: string) {
  return { id, username: 'mockUser' };
}

// ─── Start Server ──────────────────────────────────
app.listen(process.env.PORT || 5000, () => {
  console.log(`✅ OAuth Server running at http://localhost:${process.env.PORT || 5000}`);
});

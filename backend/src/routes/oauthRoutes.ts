import express, { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// JWT generation
function generateToken(user: any) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin ?? false,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
}

// OAuth success handler
router.get('/oauth/success', (req: Request, res: Response) => {
  const user = req.user as any;

  if (!user) {
    return res.redirect(`${process.env.FRONTEND_ORIGIN}/login?error=OAuth%20Failed`);
  }

  const token = generateToken(user);
  const provider = req.query.provider || 'oauth';
  const isPopup = req.query.popup === 'true';

  if (isPopup) {
    return res.send(`
      <script>
        window.opener.postMessage({
          provider: '${provider}',
          token: '${token}'
        }, '${process.env.FRONTEND_ORIGIN}');
        window.close();
      </script>
    `);
  }

  return res.redirect(`${process.env.FRONTEND_ORIGIN}/oauth/callback?token=${token}`);
});

// Utility: Handle callback redirection
function handleOAuthCallback(provider: string) {
  return (req: Request, res: Response) => {
    const isPopup = req.query.popup === 'true';
    const redirect = `/api/auth/oauth/success?provider=${provider}${isPopup ? '&popup=true' : ''}`;
    res.redirect(redirect);
  };
}

// ─── GitHub ─────────────────────────────────────────
router.get(
  '/oauth/github',
  passport.authenticate('github', {
    scope: ['user:email'],
    state: 'github',
  })
);

router.get(
  '/oauth/github/callback',
  passport.authenticate('github', {
    failureRedirect: `${process.env.FRONTEND_ORIGIN}/login`,
  }),
  handleOAuthCallback('github')
);

// ─── Discord ────────────────────────────────────────
router.get(
  '/oauth/discord',
  passport.authenticate('discord', {
    scope: ['identify', 'email'],
    state: 'discord',
  })
);

router.get(
  '/oauth/discord/callback',
  passport.authenticate('discord', {
    failureRedirect: `${process.env.FRONTEND_ORIGIN}/login`,
  }),
  handleOAuthCallback('discord')
);

export default router;

/* QCXIS SSO — OpenID Connect (OAuth 2.1 Authorization Code + PKCE), confidential client.
   Code exchange happens server-side (browser CORS is locked to qcxis.com — see SSO doc §4.4).
   Routes:  GET /auth/sso/start   -> redirect to QCXIS authorize
            GET /auth/sso/callback -> exchange code, verify id_token, upsert user, set session
   Config (env, e.g. via server/.env):
     QCXIS_ISSUER         default https://qcxis.com
     QCXIS_CLIENT_ID      (required)  — from Console → Settings → SSO apps (Confidential)
     QCXIS_CLIENT_SECRET  (required)
     QCXIS_REDIRECT_URI   default http://localhost:3000/auth/sso/callback  (must be registered EXACTLY) */
import crypto from 'node:crypto';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { q } from './db.mjs';

// read lazily so a .env loaded by the server (after imports) is picked up
let _cfg;
function CFG() {
  if (!_cfg) _cfg = {
    issuer: (process.env.QCXIS_ISSUER || 'https://qcxis.com').replace(/\/$/, ''),
    clientId: process.env.QCXIS_CLIENT_ID || '',
    clientSecret: process.env.QCXIS_CLIENT_SECRET || '',
    redirectUri: process.env.QCXIS_REDIRECT_URI || 'http://localhost:3000/auth/sso/callback',
    scope: 'openid profile email offline_access',
  };
  return _cfg;
}
// SSO is "configured" once a client_id is set. The secret is OPTIONAL: a public PKCE
// client (token_endpoint_auth_method: none) authenticates with client_id + code_verifier
// and has no secret at all (SSO doc §2.1/§4.4). Confidential clients set both.
export const ssoConfigured = () => !!CFG().clientId;

const b64url = buf => buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
// only allow same-site relative return paths (no open redirects)
const safeNext = n => (typeof n === 'string' && n.startsWith('/') && !n.startsWith('//')) ? n : '/mathurat';

/* discovery + JWKS (cached) */
let _disco = null, _jwks = null;
async function discovery() {
  if (_disco) return _disco;
  const r = await fetch(`${CFG().issuer}/.well-known/openid-configuration`);
  if (!r.ok) throw new Error(`discovery failed: ${r.status}`);
  _disco = await r.json();
  _jwks = createRemoteJWKSet(new URL(_disco.jwks_uri));
  return _disco;
}

/* short-lived store for in-flight PKCE/state (single-process). key = state */
const pending = new Map();
const TTL_MS = 10 * 60 * 1000; // consent hop must finish within 10 min (SSO doc §4.1)
function remember(state, data) {
  pending.set(state, { ...data, at: Date.now() });
  for (const [k, v] of pending) if (Date.now() - v.at > TTL_MS) pending.delete(k);
}

/* app session (reuses the `sessions` table used by /api/auth/*) */
async function createSession(res, userId) {
  const token = crypto.randomBytes(32).toString('hex');
  await q('INSERT INTO sessions(token,user_id) VALUES($1,$2)', [token, userId]);
  res.cookie('sid', token, { httpOnly: true, sameSite: 'lax', secure: process.env.COOKIE_SECURE === '1', maxAge: 1000 * 60 * 60 * 24 * 365, path: '/' });
}

/* link/create the local user from verified id_token claims */
async function upsertUser({ sub, email, name }) {
  let u = (await q('SELECT id FROM users WHERE qcxis_sub=$1', [sub])).rows[0];
  if (!u && email) u = (await q('SELECT id FROM users WHERE lower(email)=lower($1)', [email])).rows[0];
  if (u) {
    await q(`UPDATE users SET qcxis_sub=$1, name=COALESCE($2,name), email=COALESCE(email,$3),
             login_method='qcxis', last_login=now() WHERE id=$4`, [sub, name || null, email || null, u.id]);
    return u.id;
  }
  const r = await q(`INSERT INTO users(email,name,qcxis_sub,login_method,last_login)
                     VALUES($1,$2,$3,'qcxis',now()) RETURNING id`, [email || null, name || null, sub]);
  return r.rows[0].id;
}

export function mountSso(app) {
  app.get('/auth/sso/start', async (req, res) => {
    if (!ssoConfigured()) return res.redirect('/login?sso=unconfigured');
    try {
      const d = await discovery();
      const verifier = b64url(crypto.randomBytes(32));
      const challenge = b64url(crypto.createHash('sha256').update(verifier).digest());
      const state = b64url(crypto.randomBytes(24));
      const nonce = b64url(crypto.randomBytes(16));
      remember(state, { verifier, nonce, next: safeNext(req.query.next) });
      const url = new URL(d.authorization_endpoint);
      url.search = new URLSearchParams({
        response_type: 'code', client_id: CFG().clientId, redirect_uri: CFG().redirectUri,
        scope: CFG().scope, state, code_challenge: challenge, code_challenge_method: 'S256', nonce,
      }).toString();
      res.redirect(url.toString());
    } catch (e) {
      console.error('sso/start:', e.message);
      res.redirect('/login?error=' + encodeURIComponent('SSO tidak tersedia buat masa ini'));
    }
  });

  app.get('/auth/sso/callback', async (req, res) => {
    const { code, state, error } = req.query;
    if (error) return res.redirect('/login?error=' + encodeURIComponent(String(error)));
    const saved = state && pending.get(String(state));
    if (!code || !saved) return res.redirect('/login?error=' + encodeURIComponent('Sesi log masuk tamat, cuba lagi'));
    pending.delete(String(state));
    try {
      const d = await discovery();
      const cfg = CFG();
      // Exchange the code SERVER-SIDE (browser CORS is locked to qcxis.com — SSO doc §4.4).
      // Confidential clients (secret set) authenticate with HTTP Basic (client_secret_basic).
      // Public clients (no secret) send client_id in the body; PKCE code_verifier is the
      // proof (token_endpoint_auth_method: none — SSO doc §4.4 line 174).
      const form = {
        grant_type: 'authorization_code', code: String(code),
        redirect_uri: cfg.redirectUri, code_verifier: saved.verifier,
      };
      const headers = { 'content-type': 'application/x-www-form-urlencoded' };
      if (cfg.clientSecret) {
        headers.authorization = `Basic ${Buffer.from(`${cfg.clientId}:${cfg.clientSecret}`).toString('base64')}`;
      } else {
        form.client_id = cfg.clientId;
      }
      const tr = await fetch(d.token_endpoint, {
        method: 'POST', headers, body: new URLSearchParams(form).toString(),
      });
      if (!tr.ok) {
        const err = await tr.json().catch(() => ({}));
        throw new Error(`token ${tr.status}: ${err.error || tr.statusText}`);
      }
      const tokens = await tr.json();
      // verify the id_token (RS256 via JWKS, iss + aud + exp) and match nonce
      const { payload } = await jwtVerify(tokens.id_token, _jwks, { issuer: d.issuer, audience: CFG().clientId });
      if (payload.nonce && payload.nonce !== saved.nonce) throw new Error('nonce mismatch');
      const userId = await upsertUser({ sub: payload.sub, email: payload.email, name: payload.name });
      await createSession(res, userId);
      res.redirect(saved.next || '/mathurat');   // user dashboard by default
    } catch (e) {
      console.error('sso/callback:', e.message);
      res.redirect('/login?error=' + encodeURIComponent('Log masuk QCXIS gagal, cuba lagi'));
    }
  });

  // tiny status endpoint so the login page can tell if SSO is wired up
  app.get('/api/auth/sso-status', (req, res) => res.json({ configured: ssoConfigured(), issuer: CFG().issuer }));
}

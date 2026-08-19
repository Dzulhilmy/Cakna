-- In-flight QCXIS OIDC authorisation attempts (PKCE verifier + nonce + return path).
--
-- The Node implementation held these in a process-local Map, which meant: a
-- server restart mid-consent lost the login, and any second process or replica
-- failed every callback it did not itself start. Persisting them fixes both and
-- makes the flow safe behind more than one app container.
--
-- Rows are single-use (deleted on callback) and expire in 10 minutes.
CREATE TABLE sso_pending (
  state         text PRIMARY KEY,
  code_verifier text        NOT NULL,
  nonce         text        NOT NULL,
  next_path     text        NOT NULL DEFAULT '/mathurat',
  created_at    timestamptz NOT NULL DEFAULT now(),
  expires_at    timestamptz NOT NULL
);

-- Supports the opportunistic sweep of stale rows on each /auth/sso/start.
CREATE INDEX sso_pending_expires_idx ON sso_pending (expires_at);

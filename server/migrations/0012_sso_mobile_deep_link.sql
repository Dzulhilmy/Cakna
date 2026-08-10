-- Mobile SSO deep-link flag.
--
-- When the QCXIS flow is started from the mobile app (mobile=true), the
-- callback handler redirects to cakna://auth/done?token=<session_token>
-- instead of setting a browser cookie and returning to the web UI.
ALTER TABLE sso_pending ADD COLUMN IF NOT EXISTS mobile boolean NOT NULL DEFAULT false;

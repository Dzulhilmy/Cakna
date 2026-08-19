-- Interface strings & app config (were hardcoded in the frontend bundle; now DB-backed)
DROP TABLE IF EXISTS i18n, app_config CASCADE;
CREATE TABLE i18n (
  key text PRIMARY KEY,
  ms  text,
  en  text
);
CREATE TABLE app_config (
  name  text PRIMARY KEY,   -- qaris | rule_names | tj_chips | tj_desc | pz_types | pz_reasons | data_keys
  value jsonb NOT NULL
);

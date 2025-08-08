#!/usr/bin/env node

// Sync Cloudflare/Shopify dev tunnel URL from shopify.app.toml into env files
// - Reads application_url from shopify.app.toml
// - Updates HOST, SHOPIFY_API_HOST, SHOPIFY_FRONT_API_HOST, SHOPIFY_REDIRECT_URI in web/.env
// - Keeps SHOPIFY_API_REDIRECT_URI path as-is (default api/auth/callback)
// - When --watch is provided, watches the toml file for changes and resyncs automatically

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TOML_PATH = path.join(ROOT, 'shopify.app.toml');
const WEB_ENV = path.join(ROOT, 'web/.env');
const WEB_ENV_EXAMPLE = path.join(ROOT, 'web/.env.example');

function readFileSafe(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch (e) {
    return null;
  }
}

function writeFileSafe(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, 'utf8');
}

function parseTomlUrl(tomlText) {
  // Extract application_url = "https://..."
  const appUrlMatch = tomlText.match(/\bapplication_url\s*=\s*"([^"]+)"/);
  if (!appUrlMatch) return null;
  return appUrlMatch[1];
}

function ensureTrailingSlash(url) {
  if (!url) return url;
  return url.endsWith('/') ? url : url + '/';
}

function setOrReplaceEnvLine(envText, key, value) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^${escapedKey}=.*$`, 'm');
  const line = `${key}=${value}`;
  if (regex.test(envText)) {
    return envText.replace(regex, line);
  }
  // Append new line at end
  const sep = envText.length && !envText.endsWith('\n') ? '\n' : '';
  return envText + sep + line + '\n';
}

function syncOnce({ silent = false } = {}) {
  const toml = readFileSafe(TOML_PATH);
  if (!toml) {
    if (!silent) console.error(`Missing ${TOML_PATH}`);
    process.exitCode = 1;
    return;
  }
  const appUrl = parseTomlUrl(toml);
  if (!appUrl) {
    if (!silent) console.error('Could not parse application_url from shopify.app.toml');
    process.exitCode = 1;
    return;
  }

  const hostUrl = ensureTrailingSlash(appUrl);
  const hostName = appUrl.replace(/^https?:\/\//, '');

  let webEnv = readFileSafe(WEB_ENV);
  if (!webEnv) {
    webEnv = readFileSafe(WEB_ENV_EXAMPLE) || '';
  }

  // Derive redirect path from existing WEB env if present, else default
  const redirectPathMatch = webEnv.match(/^SHOPIFY_API_REDIRECT_URI=([^\n\r#]+)/m);
  const redirectPath = (redirectPathMatch ? redirectPathMatch[1].trim() : 'api/auth/callback').replace(/^\//, '');

  // Compute full redirect URL
  const redirectFull = hostUrl.replace(/\/$/, '') + '/' + redirectPath;

  let updated = webEnv;
  updated = setOrReplaceEnvLine(updated, 'HOST', hostUrl);
  updated = setOrReplaceEnvLine(updated, 'SHOPIFY_API_HOST', hostName);
  updated = setOrReplaceEnvLine(updated, 'SHOPIFY_FRONT_API_HOST', hostUrl);
  updated = setOrReplaceEnvLine(updated, 'SHOPIFY_REDIRECT_URI', redirectFull);

  if (updated !== webEnv) {
    writeFileSafe(WEB_ENV, updated);
    if (!silent) console.log(`Updated ${WEB_ENV}`);
  } else if (!silent) {
    console.log(`No changes needed in ${WEB_ENV}`);
  }
}

function watch() {
  console.log(`Watching ${TOML_PATH} for URL changes...`);
  let last = null;
  const run = () => {
    const text = readFileSafe(TOML_PATH);
    if (!text) return;
    const url = parseTomlUrl(text);
    if (!url) return;
    if (url !== last) {
      last = url;
      syncOnce({ silent: true });
      console.log(`Synced tunnel URL: ${url}`);
    }
  };
  run();
  fs.watch(TOML_PATH, { persistent: true }, () => {
    setTimeout(run, 50);
  });
}

const args = new Set(process.argv.slice(2));
if (args.has('--watch')) {
  watch();
} else {
  syncOnce();
}

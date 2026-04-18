# Security

## Scope

Halftone is a Claude Code plugin that writes files into user projects and may handle API keys for img-pilot. Threat model:

- Credential leakage (API keys committed to git or echoed in logs)
- Supply-chain tampering (altered patterns, moods, templates)
- Arbitrary file writes outside the plugin scope
- Prompt injection via `direction.md` / `brief.md` bodies
- Generated-site XSS / injected scripts

See spec §7 for the full threat model.

## Defenses (shipped in v0.1.0)

- **Auto-gitignore:** `halftone/` paths added to project `.gitignore` on first run
- **chmod 600** on key files (`halftone/.keys`, `halftone/.env`)
- **Pre-commit hook:** scans staged diffs for API key patterns (`sk-`, `AIza`, `api_key = "..."`, `IMG_PILOT_KEY=`, `RUNWAY_API_KEY=`, `KLING_`)
- **FS scope enforcer:** throws on writes outside the whitelist (`halftone/`, `src/`, `static/`, `public/`, `package.json` append, `.gitignore` append)
- **Prompt-injection filter:** scans `direction.md` / `brief.md` bodies for known injection patterns before passing content into Claude prompts
- **Pattern integrity:** sha256 per entry in `patterns/index.json`, verified at runtime before loading
- **Dependency pinning:** exact versions in `package.json` (no `^`, no `~`)
- **CSP starter templates** with nonce-based policies, no `unsafe-inline` for scripts
- **No runtime code fetching:** all patterns, moods, fonts ship with the release tarball

## Reporting vulnerabilities

Private disclosure: open a [GitHub Security Advisory](https://github.com/Sakaax/halftone/security/advisories/new).

SLA target:
- Acknowledge within 48h
- Critical fix or mitigation within 14 days
- Medium within 30 days

Post-fix, an advisory is published in-repo with a CVE if applicable.

# Security Policy

## Supported Versions

Only the latest release of AlertTicker Card receives security updates. Please make sure you are running the most recent version before reporting a vulnerability.

| Version | Supported |
|---------|-----------|
| Latest release | ✅ |
| Older versions | ❌ |

## Reporting a Vulnerability

If you discover a security vulnerability in AlertTicker Card, **please do not open a public GitHub issue**. Instead, report it privately using one of these channels:

- 🔒 [GitHub Security Advisories](https://github.com/djdevil/AlertTicker-Card/security/advisories/new) — preferred, private disclosure with a coordinated fix
- 📧 Email: divil_17@hotmail.com

Please include:

- A clear description of the vulnerability and its potential impact
- Steps to reproduce (or a proof-of-concept)
- The version of AlertTicker Card affected
- Any suggested mitigation or patch

## Response Timeline

You can expect an acknowledgement within a few days. A fix will be prepared and released as soon as reasonably possible depending on severity.

## Scope

AlertTicker Card is a client-side Lovelace custom card. Security-relevant issues typically include:

- Cross-site scripting (XSS) via user config or template rendering
- Prototype pollution or unsafe deserialization
- Any behaviour that leaks Home Assistant state or credentials outside the browser session

Issues in Home Assistant itself, HACS, or third-party integrations are out of scope — please report those to their respective projects.

Thanks for helping keep AlertTicker Card and its users safe! 🙏

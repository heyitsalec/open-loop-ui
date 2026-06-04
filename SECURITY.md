# Security Policy

Open Loop UI is a frontend package plus adapter boundary. The package does not write files, call model providers, or submit to external services by itself.

## Supported Versions

Security fixes target the latest published minor version until the project publishes a broader support policy.

## Reporting a Vulnerability

Please report security issues privately by opening a GitHub security advisory or emailing the maintainer listed in `package.json`.

Include:

- A short description of the issue.
- Reproduction steps or proof of concept.
- The affected version or commit.
- Any known mitigation.

Please do not open a public issue for vulnerabilities.

## Adapter Safety

Host applications own adapter security. If you build an adapter, validate user/session permissions, avoid passing secrets to the browser, constrain CLI commands, and treat payload text as untrusted input.

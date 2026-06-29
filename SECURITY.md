# Security Policy

## Reporting a vulnerability

If you discover a security issue in this project, please do not open a public
issue. Email **Sanbunpaudal299@gmail.com** with details and steps to reproduce.
You will get an acknowledgement within a few days.

## Handling of secrets

- No secrets are committed. `.env*` and credential files are git-ignored.
- All database, auth and storage access runs server-side (Server Actions and
  Route Handlers); the browser never holds privileged keys.
- Supabase Row Level Security restricts public reads to published content and
  blocks all public writes; every mutation goes through a service-role client on
  the server.
- Blog HTML from the admin editor is sanitized with DOMPurify on write and again
  on render.

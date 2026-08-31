# Hostinger Node.js demo

Minimal Node.js app with no npm dependencies, ready to upload as a ZIP in
Hostinger hPanel.

## Contents

```
app.js            HTTP server (static files + /api/health + /api/echo)
package.json      main: app.js, start script: node app.js
public/           index.html, styles.css, app.js
```

## Deploy in hPanel

1. hPanel → **Websites** → your site → **Advanced → Node.js**.
2. Create an application:
   - **Application root**: e.g. `nodejs-demo` (or `public_html`)
   - **Application URL**: your domain or subdomain
   - **Application startup file**: `app.js`
   - **Node.js version**: 18 or newer
3. **File Manager** → open the application root → **Upload** →
   `hostinger-nodejs-demo.zip` → right-click → **Extract** here.
   Make sure `app.js` and `package.json` sit directly in the application root,
   not inside a nested folder.
4. Back in the Node.js panel: **NPM Install** (optional — there are no
   dependencies), then **Restart**.
5. Open your domain. You should see "Node.js app is running" and a live health
   readout.

## Notes

- The server binds `process.env.PORT` — Hostinger injects it. Do not hardcode a port.
- `/api/health` returns JSON: status, Node version, uptime, timestamp.
- `POST /api/echo` returns the request body (capped at 10 KB).
- Static file paths are resolved inside `public/` only; `../` traversal is rejected.

## Run locally

```bash
npm start          # http://localhost:3000
PORT=8080 npm start
```

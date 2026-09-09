# solidstart-ssr-hello-world-app

SolidStart SSR app (vinxi + Nitro node-server preset) with PostgreSQL on Zerops nodejs@24.

## Zerops service facts

- HTTP port: `3000`
- Siblings: `db` (PostgreSQL) — env: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`
- Runtime base: `nodejs@24`

## Zerops dev

`setup: dev` idles on `zsc noop --silent`; the agent starts the dev server.

- Dev command: `npm run dev`
- In-container rebuild without deploy: `npm run build`

**All platform operations (start/stop/status/logs of the dev server, deploy, env / scaling / storage / domains) go through the Zerops development workflow via `zcp` MCP tools. Don't shell out to `zcli`.**

## Notes

- Nitro preset `node-server` (set in `app.config.ts`) bundles all deps into `.output/` — no `node_modules` at prod runtime.
- In prod, `initCommands` runs `migrate.cjs` with `NODE_PATH=/var/www/.output/server/node_modules` because `pg` lives inside the Nitro-bundled `node_modules`. CJS `require()` respects `NODE_PATH`; ESM `import` does not — hence `.cjs`.
- Favicon lives in `public/favicon.ico`.

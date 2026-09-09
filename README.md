# SolidStart SSR Hello World Recipe App

<!-- #ZEROPS_EXTRACT_START:intro# -->
A server-rendered [SolidStart](https://start.solidjs.com) application connected to a [PostgreSQL](https://zerops.io/postgresql) database, running on [Zerops](https://zerops.io). SolidStart's Nitro engine produces a self-contained server bundle — no `node_modules` deployed at runtime.
Used within [SolidStart SSR Hello World recipe](https://app.zerops.io/recipes/solidstart-ssr-hello-world) for [Zerops](https://zerops.io) platform.
<!-- #ZEROPS_EXTRACT_END:intro# -->

⬇️ **Full recipe page and deploy with one-click**

[![Deploy on Zerops](https://github.com/zeropsio/recipe-shared-assets/blob/main/deploy-button/light/deploy-button.svg)](https://app.zerops.io/recipes/solidstart-ssr-hello-world?environment=small-production)

![solidstart cover](https://github.com/zeropsio/recipe-shared-assets/blob/main/covers/svg/cover-solidstart.svg)

## Integration Guide

### 1. Adding `zerops.yaml`
The main application configuration file you place at the root of your repository, it tells Zerops how to build, deploy and run your application.

<!-- #ZEROPS_EXTRACT_START:integration-guide# -->
```yaml
# SolidStart SSR Hello World — Zerops build & deploy pipeline.
# Two setups: 'prod' for optimized server builds, 'dev' for SSH
# development workspaces. Select via zeropsSetup in import.yaml.
zerops:
  # prod: builds a self-contained Nitro server bundle (.output/).
  # Nitro (the server engine powering SolidStart) traces and bundles
  # all runtime dependencies — no node_modules needed at runtime.
  - setup: prod
    build:
      base: nodejs@24
      buildCommands:
        # npm ci installs exact locked versions. Fails fast if
        # package-lock.json is out of sync — intentional for prod.
        - npm ci
        # vinxi build invokes Nitro with the node-server preset,
        # producing a self-contained bundle in .output/.
        - npm run build
      deployFiles:
        # Nitro bundles all dependencies into .output/ — no
        # node_modules needed at runtime. The migration script
        # is listed separately (outside the bundle).
        - .output
        - migrate.cjs
      cache:
        # node_modules cached between builds — npm ci restores
        # from cache, skipping network downloads on unchanged deps.
        - node_modules

    # readinessCheck: verifies each new runtime container is healthy
    # before the project balancer routes traffic to it. Prevents
    # a broken deploy from ever reaching users.
    deploy:
      readinessCheck:
        httpGet:
          port: 3000
          path: /

    run:
      base: nodejs@24
      # initCommands run once per container start, before the
      # start command — every deploy, restart, and scale-up event.
      initCommands:
        # zsc execOnce runs the migration exactly once per app
        # version across all containers. Without it, every container
        # in a multi-container deploy races to run the same SQL.
        # NODE_PATH points to pg bundled by Nitro into
        # .output/server/node_modules. CJS require() respects
        # NODE_PATH; ESM import does not — hence migrate.cjs.
        - zsc execOnce ${appVersionId} -- sh -c 'NODE_PATH=/var/www/.output/server/node_modules node migrate.cjs'
      ports:
        - port: 3000
          httpSupport: true
      envVariables:
        NODE_ENV: production
        # DB_* variables reference generated credentials from the
        # 'db' PostgreSQL service. Pattern: ${hostname_key}.
        DB_NAME: db
        DB_HOST: ${db_hostname}
        DB_PORT: ${db_port}
        DB_USER: ${db_user}
        DB_PASS: ${db_password}
      # Nitro node-server preset entry point — self-contained,
      # reads PORT env var automatically (default: 3000).
      start: node .output/server/index.mjs

  # dev: deploys full source code for interactive SSH development.
  # The container stays idle (zsc noop) — developer drives via SSH.
  - setup: dev
    build:
      base: nodejs@24
      # Ubuntu for the build container: richer toolset for
      # interactive development (git, curl, editors pre-installed).
      os: ubuntu
      buildCommands:
        # npm install (not npm ci) — dev may lack a lock file or
        # need flexible resolution during active development.
        - npm install
      # Deploy the full working directory: source code, node_modules,
      # config files — everything needed to run the dev server via SSH.
      deployFiles: ./
      cache:
        - node_modules

    run:
      base: nodejs@24
      os: ubuntu
      initCommands:
        # Migration runs on dev too — database is ready when
        # the developer SSHs in. In dev, node_modules/ is
        # deployed so pg resolves from the standard path.
        - zsc execOnce ${appVersionId} -- node migrate.cjs
      ports:
        - port: 3000
          httpSupport: true
      envVariables:
        NODE_ENV: development
        DB_NAME: db
        DB_HOST: ${db_hostname}
        DB_PORT: ${db_port}
        DB_USER: ${db_user}
        DB_PASS: ${db_password}
      # zsc noop keeps the container running without starting the app.
      # SSH in and run: npm run dev
      start: zsc noop --silent
```
<!-- #ZEROPS_EXTRACT_END:integration-guide# -->

# GitHub Deployment Setup

The deployment workflow publishes the application image to GitHub Container Registry (GHCR), then triggers Coolify only after all security checks pass.

Coolify is currently hosted at `http://145.239.64.235:8000`. This is the dashboard URL, not the deployment webhook URL.

## 1. Create the `production` environment

In GitHub:

1. Open **Settings > Environments**.
2. Create an environment named `production`.
3. Add required reviewers if production deployments need approval.
4. Add the secrets below to the `production` environment, not as general repository secrets.

## 2. Configure environment secrets

### `COOLIFY_WEBHOOK_URL`

Open `http://145.239.64.235:8000`, select the application that deploys this project, create or copy its deploy webhook, and store the full webhook URL as `COOLIFY_WEBHOOK_URL`. Do not use the dashboard URL itself as the secret value.

### `COOLIFY_TOKEN`

If the Coolify webhook requires bearer authentication, store its token as `COOLIFY_TOKEN`. If the webhook is already authenticated by its URL and does not require a bearer token, the workflow should omit the authorization header.

Do not commit either value to the repository.

Because this Coolify instance uses HTTP, avoid exposing the dashboard or webhook publicly without network controls. Prefer HTTPS with a reverse proxy before using it from production CI.

## 3. Allow GHCR access in Coolify

Configure the Coolify application to pull the image from:

```text
ghcr.io/<github-owner>/<repository>:latest
```

Configure registry credentials in Coolify if the package is private. The GitHub token used by Actions has `packages: write` permission so the workflow can publish the image.

## 4. Required GitHub Actions permissions

The deployment workflow already requests:

- `contents: read` to check out source
- `packages: write` to publish the container to GHCR

If the organization restricts workflow permissions, enable Actions to write packages or explicitly grant the repository package permission.

## 5. Protect the security checks

In **Settings > Branches**, add a branch protection rule for `main` and require these checks:

```text
Security / Dependency audit
Security / CodeQL
Security / Secret scan
Security / Container scan
```

The deployment workflow also depends on the reusable `Security` workflow. A failed security job prevents image publishing and deployment.

## 6. Verify the setup

After configuring the environment and Coolify:

1. Push a change to `main` or manually run **Deploy** from the Actions tab.
2. Confirm all security jobs pass.
3. Confirm the image appears in **Packages** under the repository.
4. Approve the `production` environment if reviewers are configured.
5. Confirm Coolify receives the webhook and redeploys the new image.

If the Coolify webhook uses URL authentication only, update the deployment step to remove the `Authorization` header and the `COOLIFY_TOKEN` requirement.

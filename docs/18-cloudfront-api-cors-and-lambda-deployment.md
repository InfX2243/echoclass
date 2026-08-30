# CloudFront Web Deployment: API CORS and Lambda Deployment

**Status:** Current deployment troubleshooting and verification notes — August 30, 2026.

## Problem observed

The deployed CloudFront application was calling:

```text
https://o8ppwi4xwf.execute-api.ap-southeast-2.amazonaws.com/api/v1/me
```

from:

```text
https://ddf9lplgkbhew.cloudfront.net
```

The browser reported a failed CORS preflight, while CloudWatch reported:

```text
Runtime.UserCodeSyntaxError: SyntaxError: Identifier 'label' has already been declared
```

## Root-cause interpretation

There are two separate layers involved:

1. **Lambda runtime failure:** the Lambda artifact currently running in AWS contains a duplicate `label` declaration. The repository version of `infrastructure/lambda/api-handler.mjs` on `feat/cloudfront-web-deployment` does not contain that declaration. This means the deployed Lambda artifact is not identical to the source currently tracked by this branch.
2. **API Gateway CORS deployment state:** the repository CDK configuration already allows both `http://localhost:5173` and the deployed CloudFront origin, with `content-type` and `authorization` headers and CORS preflight support. API Gateway must actually deploy those configuration changes to the active stage; changing the CORS form without deploying leaves the active API configuration unchanged.

Because API Gateway can handle CORS preflight before invoking the Lambda integration, the first verification step is to make sure the API Gateway CORS configuration is deployed. If OPTIONS still reaches Lambda, the Lambda syntax error must be fixed/deployed first.

## Required deployment sequence

From the repository root:

```bash
pnpm install
pnpm --filter web build
pnpm --dir infrastructure validate:lambda
pnpm --dir infrastructure build
pnpm --dir infrastructure synth
pnpm --dir infrastructure cdk deploy
```

The production Vite build must exist before CDK synthesis because the web distribution deploys `apps/web/dist`.

After deployment:

1. Open API Gateway and select the deployed/default stage.
2. Confirm CORS contains:
   - `https://ddf9lplgkbhew.cloudfront.net`
   - `http://localhost:5173`
   - `content-type`
   - `authorization`
   - `OPTIONS` plus the application methods.
3. **Deploy the API changes to the stage.** The orange **Deploy** button in the API Gateway console indicates that configuration changes still need to be deployed.
4. Invoke `OPTIONS /api/v1/me` from a browser/devtools or an HTTP client with:

```text
Origin: https://ddf9lplgkbhew.cloudfront.net
Access-Control-Request-Method: GET
Access-Control-Request-Headers: authorization,content-type
```

The preflight should return a successful 2xx response with the CloudFront origin in `Access-Control-Allow-Origin`.

5. Check the Lambda CloudWatch log group after the next API request. The application Lambda now emits a deployment revision marker:

```text
cloudfront-web-deployment-cors-v2
```

Seeing this marker confirms that the Lambda asset from the current branch has been deployed rather than an older console-edited artifact.

## Why the Lambda source validation was added

The infrastructure package now exposes:

```bash
pnpm --dir infrastructure validate:lambda
```

This runs `node --check` against every Lambda `.mjs` file before deployment. It catches syntax errors such as duplicate declarations before an invalid artifact can reach Lambda.

## Important distinction

CORS is not an authentication mechanism. The API remains protected by Cognito bearer-token verification. CORS only controls which browser origins may make cross-origin requests.

The deployed CloudFront application is an allowed browser origin; it does not make the API public.

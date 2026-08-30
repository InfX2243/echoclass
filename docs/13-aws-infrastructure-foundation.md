# EchoClass — AWS Infrastructure Foundation

This document records the current AWS infrastructure boundary for EchoClass MVP, including the public web deployment and private CloudFront media delivery.

## Environment

- Environment name: `dev` by default; `prod` uses production retention policies.
- Default development region: `ap-southeast-2` (Sydney).
- Infrastructure as code: AWS CDK with TypeScript.
- Stack name: `EchoClass-<environment>`.

The region is configurable through standard CDK/AWS environment variables. The current Cognito User Pool is in `ap-southeast-2`.

## Current resource set

```mermaid
flowchart TB
  Browser[Browser]
  Cognito[Cognito]
  API[API Gateway HTTP API]
  App[Application Lambda]
  Echo[Echo Lambda]
  DB[(DynamoDB)]
  MediaS3[(Private media S3)]
  MediaCF[CloudFront media\nSigned URL + cache]
  WebS3[(Private web S3)]
  WebCF[CloudFront web app]
  KeyGroup[CloudFront trusted key group]
  Secret[Secrets Manager\nPrivate signing key]

  Browser --> Cognito
  Browser --> API
  API --> App
  API --> Echo
  App --> DB
  Echo --> DB
  Browser -. direct multipart upload .-> MediaS3
  App -->|short-lived signed URL| Browser
  Browser --> MediaCF
  MediaCF --> KeyGroup
  MediaCF --> MediaS3
  App --> Secret
  MediaCF -->|OAC / SigV4| MediaS3
  Browser --> WebCF
  WebCF --> WebS3
```

### Application data

- DynamoDB application table with `PK`/`SK`.
- `GSI1` and `GSI2` for documented alternate access patterns.
- On-demand billing.
- AWS-managed encryption.
- Point-in-time recovery.

### Private media

- Private S3 media bucket.
- Block Public Access enabled.
- Bucket-owner-enforced ownership.
- SSL enforced.
- Browser multipart-upload CORS for localhost.
- Lifecycle cleanup for abandoned multipart uploads.
- Dedicated CloudFront media distribution using Origin Access Control (OAC).
- CloudFront trusted key group for signed viewer URLs.
- Secrets Manager stores the matching private signing key.
- Application Lambda has read-only access to the signing secret and generates short-lived playback URLs after authorization.
- S3 policy grants `s3:GetObject` only to the CloudFront service principal scoped to that distribution.

### Public web application delivery

- Separate private S3 bucket for the Vite production bundle.
- Block Public Access enabled.
- Bucket-owner-enforced ownership.
- Dedicated CloudFront distribution using OAC.
- Viewer HTTP redirected to HTTPS.
- `index.html` is the default root object.
- CloudFront 403/404 responses are mapped to `/index.html` with status 200 for React Router deep links.
- CDK `BucketDeployment` uploads `apps/web/dist` and invalidates the distribution after deployment.

The web S3 bucket is **not** an S3 website endpoint. CloudFront is the public delivery boundary.

### API

- API Gateway HTTP API.
- Public `/health` route.
- Dedicated Echo routes, including `/api` and `/api/v1` prefixes.
- Catch-all application Lambda integration.
- CORS allows localhost plus a configurable deployed web origin through CDK context or `ECHOCLASS_WEB_ORIGIN`.
- API authorization continues to use Cognito access tokens.

### Lambda

- Node.js 22.x runtime.
- Separate application and Echo handlers.
- DynamoDB access.
- Application Lambda has media-bucket access for upload verification and media metadata.
- Application Lambda has read access to the CloudFront signing secret.
- Lambda does not proxy video bytes during browser playback.

## Media delivery security boundary

```mermaid
sequenceDiagram
  participant Browser
  participant API as API Gateway
  participant Lambda
  participant Secret as Secrets Manager
  participant CF as CloudFront
  participant S3 as Media S3

  Browser->>API: Authorized playback request
  API->>Lambda: Cognito-authenticated invocation
  Lambda->>Lambda: Check role, lesson state, membership
  Lambda->>Secret: Read private signing key
  Secret-->>Lambda: Private key
  Lambda-->>Browser: Short-lived signed CloudFront URL
  Browser->>CF: Signed GET / Range request
  CF->>CF: Verify signature + expiry
  CF->>S3: OAC/SigV4 request
  S3-->>CF: Object bytes
  CF-->>Browser: Cached media bytes
```

## Deployment dependency

The web distribution deploys a prebuilt Vite bundle. Therefore:

1. Configure `apps/web/.env.production` with the deployed API base URL and public Cognito settings.
2. Configure the CloudFront media signing public key and Secrets Manager ARN as deployment environment variables.
3. Run `pnpm --filter web build`.
4. Run CDK synth/deploy.

The stack fails early when the required media signing configuration is missing. This prevents deploying a media distribution that cannot issue valid playback URLs.

## Required media signing configuration

The deployment expects:

```text
ECHOCLASS_MEDIA_PUBLIC_KEY=<PEM public key>
ECHOCLASS_MEDIA_SIGNING_SECRET_ARN=<Secrets Manager ARN>
```

The Secrets Manager value is JSON containing the corresponding RSA private key:

```json
{
  "privateKey": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----"
}
```

Neither the private key nor the secret value belongs in Git.

## Outputs

The stack exports:

- application DynamoDB table name
- media bucket name
- media CloudFront distribution ID/domain
- media CloudFront trusted key group ID
- media CloudFront public key ID
- web bucket name
- web CloudFront distribution ID/domain
- API Gateway URL
- configured web origin
- environment name
- resolved AWS region

## Security boundary

The infrastructure repository must never contain AWS access keys, database credentials, CloudFront private keys, or Secrets Manager values. Public Vite configuration is limited to values intentionally safe to expose to browsers, such as an API URL and Cognito public identifiers.

S3 media and web buckets remain private. CloudFront OAC is the intended S3 access path for both delivery layers.

## Current deployment milestone

The web application is deployed through its own CloudFront distribution on `feat/cloudfront-web-deployment`. The media CloudFront distribution is now also configured for signed viewer access and cached delivery. The remaining operational step is supplying the signing key pair/secret in the target AWS environment and running the final playback smoke test.

# EchoClass infrastructure

AWS CDK TypeScript infrastructure for the EchoClass MVP and its CloudFront delivery layers.

## Environment

The stack defaults to `dev`. Override it with the CDK context value:

```bash
pnpm --filter @echoclass/infrastructure exec cdk synth -c environment=dev
```

The current deployment region is `ap-southeast-2` unless overridden through the standard CDK/AWS environment variables.

## Current resources

The stack provisions:

- DynamoDB application table with GSIs;
- private S3 media bucket;
- private S3 web bucket;
- CloudFront media distribution with OAC;
- CloudFront trusted key group for signed media URLs;
- CloudFront web distribution with OAC and SPA fallback;
- API Gateway HTTP API;
- application Lambda;
- Echo Lambda;
- Cognito-backed API authorization integration;
- CloudWatch log groups.

## Media signing configuration

Media playback requires a CloudFront RSA key pair.

Store the private key in AWS Secrets Manager as JSON:

```json
{
  "privateKey": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----"
}
```

Provide the matching public key and secret ARN during deployment:

```bash
export ECHOCLASS_MEDIA_PUBLIC_KEY="$(cat media-public-key.pem)"
export ECHOCLASS_MEDIA_SIGNING_SECRET_ARN="<Secrets Manager ARN>"
```

Do not commit the private key or the secret value.

## Deployment prerequisites

The web distribution deploys the compiled Vite application, so build it before CDK synth/deploy:

```bash
pnpm --filter web build
pnpm --filter @echoclass/infrastructure synth
pnpm --filter @echoclass/infrastructure exec cdk deploy EchoClass-dev
```

If the production web build is missing, the CDK stack fails with a clear error rather than deploying an empty web origin.

See `docs/13-aws-infrastructure-foundation.md`, `docs/16-private-media-delivery.md`, and `docs/22-cloudfront-media-playback-implementation.md` for the detailed architecture and verification steps.

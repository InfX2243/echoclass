# EchoClass infrastructure

AWS CDK TypeScript foundation for the EchoClass MVP development environment.

## Environment

The stack defaults to `dev`. Override it with the CDK context value:

```bash
pnpm --filter @echoclass/infrastructure exec cdk synth -c environment=dev
```

The AWS region defaults to `ap-south-2` for local development and can be overridden with `CDK_DEFAULT_REGION`/`AWS_REGION`.

This foundation intentionally creates no application resources yet. Resource work is introduced by the subsequent MVP infrastructure steps:

- MVP-011 DynamoDB
- MVP-012 private S3 media bucket
- MVP-013 CloudFront private media delivery
- MVP-014 API Gateway + Lambda

# EchoClass — AWS Infrastructure Foundation

This document records the implementation boundary for MVP-010 from the MVP execution plan.

## Environment

- Environment name: `dev`
- Default development region: `ap-south-1` (Mumbai)
- Infrastructure as code: AWS CDK with TypeScript
- Stack name: `EchoClass-dev`

The region is configurable through the standard CDK/AWS environment variables and is not hard-coded into deployed resource definitions.

## Resource naming

Application resources introduced by later MVP steps should use the `EchoClass` project prefix and environment name. Resource-specific names should remain deterministic and avoid embedding credentials or user data.

## Outputs

The foundation exports the environment name and resolved AWS region. Resource IDs/URLs will be added by MVP-011 through MVP-014 as those resources are introduced.

## Security boundary

The infrastructure repository must never contain AWS access keys, Cognito secrets, database credentials, or other runtime secrets. Local CDK deployment uses the developer's configured AWS credentials outside the frontend source tree.

## Scope

MVP-010 intentionally does **not** create DynamoDB, S3, CloudFront, API Gateway, Lambda, or application Cognito resources. Those belong to the ordered MVP-011 through MVP-014 slices.

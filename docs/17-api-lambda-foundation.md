# EchoClass — API Gateway + Lambda Foundation

MVP-014 establishes the HTTP API and Lambda execution boundary for the EchoClass backend.

## Runtime boundary

- API Gateway HTTP API is the public application API entry point.
- Lambda owns request handling and application authorization logic.
- DynamoDB is accessed by Lambda; the browser never receives AWS database credentials.
- S3 remains the media store; Lambda is not a video-byte proxy.
- CloudFront remains the private media delivery layer.

## Local development

The HTTP API CORS policy explicitly permits `http://localhost:5173` so the existing web application can call the deployed development API from localhost.

The foundation exposes `/health` as a smoke-test endpoint. Application routes and Cognito JWT authorization are introduced in the following API implementation slices.

## Permissions

The API Lambda receives least-privilege access to the current MVP resources: read/write access to the application DynamoDB table and read/write access to the private media bucket. Future processing functions should receive narrower permissions rather than inheriting this role.

## Secrets

No AWS credentials or application secrets are committed. Runtime configuration is provided through Lambda environment variables and AWS-managed identity/permissions.

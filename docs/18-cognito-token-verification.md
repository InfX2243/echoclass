# EchoClass — Cognito Token Verification

MVP-020 verifies Cognito access tokens inside the API Lambda before protected application routes are handled.

## Verification rules

Protected requests must send:

`Authorization: Bearer <access-token>`

The middleware verifies:

- JWT structure.
- RS256 signature against the Cognito User Pool JWKS.
- Signing key identifier.
- Cognito issuer.
- `token_use` is `access`.
- App client identifier matches the configured EchoClass client.
- Expiration has not passed.

Cognito public signing keys are cached in the warm Lambda runtime for up to one hour.

`GET /health` remains unauthenticated for deployment and operational checks. All other routes currently routed through the Lambda require a valid access token before the handler continues.

The User Pool ID and App Client ID are configuration identifiers, not AWS credentials. No Cognito client secret or AWS credentials are stored in the repository.

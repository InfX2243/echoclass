# EchoClass — Private Media Delivery

> **Status:** Implemented on `feat/cloudfront-web-deployment`.

This document describes the complete private lesson-video delivery path. The media bucket remains private, CloudFront is the only S3 read path, and the application API authorizes a student before issuing a short-lived CloudFront signed URL.

## Architecture

```mermaid
sequenceDiagram
  participant B as Student Browser
  participant API as API Gateway
  participant L as Application Lambda
  participant DB as DynamoDB
  participant CF as Media CloudFront
  participant S3 as Private Media S3

  B->>API: GET /lessons/{lessonId}/playback + Cognito token
  API->>L: Invoke application Lambda
  L->>DB: Verify published lesson + active membership
  DB-->>L: Authorized lesson metadata
  L->>L: Create short-lived CloudFront signed URL
  L-->>API: playbackUrl + expiresAt
  API-->>B: JSON playback access
  B->>CF: GET signed media URL
  CF->>CF: Validate signature + expiry
  CF->>S3: OAC/SigV4 origin request
  S3-->>CF: Video bytes / byte range
  CF-->>B: Cached video response
```

## Origin Access Control

The media distribution uses CloudFront Origin Access Control (OAC) with SigV4 signing on every origin request. The S3 bucket policy grants `s3:GetObject` only to the CloudFront service principal and only when `AWS:SourceArn` matches the EchoClass media distribution.

No Origin Access Identity or public bucket access is used.

## Viewer authorization

The playback endpoint remains application-authorized:

1. Cognito access token is verified by Lambda.
2. The requester must be a student.
3. The lesson must exist and be `PUBLISHED`.
4. The student must have an active membership in the lesson's class.
5. The lesson must have a registered media object key.
6. Only then is a signed CloudFront URL generated.

Lambda never proxies the video bytes.

## CloudFront signed URLs

The distribution now requires a trusted CloudFront key group for its default cache behavior. The CDK stack creates the public-key resource and key group from the configured PEM public key.

The matching private key is stored outside source control in AWS Secrets Manager. The secret is read only by the application Lambda through its IAM execution role.

The signer accepts the private key as either raw PEM text or JSON containing a `privateKey` field. Literal `\\n` sequences and whitespace-collapsed PEM values are normalized before signing. The generated signature uses CloudFront's required URL-safe Base64 mapping (`+` → `-`, `=` → `_`, `/` → `~`). This normalization is important because an incorrectly encoded signature is rejected by CloudFront with HTTP 403.

The API uses a short-lived canned signed-URL policy. The URL lifetime is configured by the Lambda signer and must be long enough for normal playback and range requests while remaining an authorization capability rather than a permanent media credential.

The browser therefore receives a URL shaped like:

```text
https://<media-distribution>.cloudfront.net/lessons/<lessonId>/video.mp4
  ?Expires=<epoch>
  &Key-Pair-Id=<cloudfront-public-key-id>
  &Signature=<signature>
```

The signed URL is an authorization capability, not an S3 credential. It does not expose the S3 bucket or object through a public S3 endpoint.

## Progressive video playback and range requests

The browser does **not** wait for the complete MP4 to download before playback starts. The HTML5 video element progressively buffers media and requests additional bytes while playback continues.

```mermaid
flowchart LR
  Browser[HTML5 Video Element]
  Buffer[Browser Media Buffer]
  CF[CloudFront]
  Cache[CloudFront Cache]
  S3[(Private Media S3)]

  Browser -->|Initial byte-range request| CF
  CF --> Cache
  Cache -->|Cache miss| S3
  S3 --> CF
  CF --> Buffer
  Buffer -->|Enough data buffered| Play[Playback starts]
  Play --> Browser
  Browser -->|Additional ranges / seeking| CF
```

Typical behavior is:

1. the browser requests an initial byte range;
2. CloudFront serves the requested bytes from cache or retrieves them from S3;
3. the browser buffers enough media data to begin decoding and playback;
4. additional byte ranges are fetched in the background as needed;
5. seeking can trigger requests for different portions of the object.

The exact buffer size and request pattern are controlled by the browser and media stack. EchoClass does not explicitly download the entire video before assigning it to the player.

This makes large lesson videos practical while also allowing CloudFront to cache reusable media content close to students.

## Caching behavior

The media cache behavior:

- allows `GET` and `HEAD`;
- supports normal HTTP byte-range requests used by HTML5 video seeking;
- redirects HTTP viewers to HTTPS;
- does **not** forward arbitrary query strings to S3;
- does not forward cookies;
- caches the video object by its path.

This is important because CloudFront validates signed URL parameters at the viewer boundary. The `Expires`, `Key-Pair-Id`, and `Signature` parameters do not need to reach S3 and should not fragment the origin cache key.

As a result, different authorized students requesting the same lesson object can be served by the same CloudFront cached object while every viewer request is still checked for a valid, unexpired signature.

## Security invariants

- S3 Block Public Access remains enabled.
- Direct anonymous S3 reads remain denied.
- CloudFront is the only media origin reader.
- API Gateway/Lambda never streams video bytes.
- Students cannot obtain a playback URL without passing application authorization.
- Signed URLs expire automatically.
- The private signing key is never included in the browser bundle or Git repository.
- The CloudFront distribution, not S3, is the browser's media origin.

## One-time signing-key setup

Generate an RSA key pair locally and store only the private key in Secrets Manager:

```bash
openssl genrsa -out media-private-key.pem 2048
openssl rsa -in media-private-key.pem -pubout -out media-public-key.pem

aws secretsmanager create-secret \
  --name EchoClass/dev/cloudfront-media-signer \
  --secret-string "$(python -c 'import json; print(json.dumps({"privateKey":open("media-private-key.pem").read()}))')"
```

Then deploy with the public key and secret ARN:

```bash
export ECHOCLASS_MEDIA_PUBLIC_KEY="$(cat media-public-key.pem)"
export ECHOCLASS_MEDIA_SIGNING_SECRET_ARN="<Secrets Manager secret ARN>"

pnpm --filter @echoclass/infrastructure synth
pnpm --filter @echoclass/infrastructure exec cdk deploy EchoClass-dev
```

The private-key file should be removed from the developer workstation when no longer needed and must never be committed.

## Rotation

A future rotation can add a second public key to the trusted key group, deploy Lambda with the matching private key, allow existing signed URLs to expire, and then remove the old public key. Rotation should be treated as an operational security procedure rather than an application-level feature.

## Outputs

The CDK stack exposes:

- `MediaDistributionId`
- `MediaDistributionDomainName`
- `MediaKeyGroupId`
- `MediaPublicKeyId`

The API Lambda also receives the media distribution domain, signing secret ARN, and CloudFront public-key ID through server-side environment configuration.

# EchoClass — Private Media Storage

This document defines the MVP-012 private S3 media boundary.

## Bucket

The development stack creates one private media bucket per environment:

`echoclass-<environment>-media-<account>`

The bucket is configured with:

- S3 Block Public Access enabled.
- S3-managed server-side encryption.
- Bucket-owner-enforced object ownership.
- SSL-only bucket access.
- No public bucket or object policy.
- Development deletion cleanup; production retention.

## Object key convention

Application code must derive object keys server-side. Clients must never select an arbitrary S3 path.

The MVP convention is:

`uploads/pending/<classId>/<lessonId>/<uploadId>/<filename>`

After a successful completion flow, the backend may promote the object to a stable ready prefix. The exact promotion mechanism belongs to the upload implementation step and must preserve server-controlled ownership and lesson association.

## Abandoned uploads

Objects under `uploads/pending/` expire after seven days. This is a cleanup safeguard for interrupted browser uploads and is not the authoritative media lifecycle state; DynamoDB remains the source of application metadata/status.

## Access boundary

No anonymous browser request may read media directly from S3. Later upload authorization will use short-lived server-generated authorization, and later playback will use CloudFront private delivery.

Lambda/API Gateway must never proxy video bytes.

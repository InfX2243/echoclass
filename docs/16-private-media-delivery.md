# EchoClass — Private Media Delivery

MVP-013 adds CloudFront in front of the private media bucket. S3 remains non-public; CloudFront is the only service principal granted object-read access.

## Origin Access Control

The distribution uses CloudFront Origin Access Control (OAC) with SigV4 signing on every origin request. The bucket policy grants `s3:GetObject` only to `cloudfront.amazonaws.com` and only when `AWS:SourceArn` matches the EchoClass distribution.

No Origin Access Identity or public bucket access is used.

## Viewer boundary

The distribution only permits `GET` and `HEAD` and redirects HTTP viewers to HTTPS. Query strings are forwarded because the later private playback authorization flow may use signed delivery parameters.

The current MVP foundation does not yet implement signed CloudFront URLs/cookies. Playback authorization belongs to the API/Lambda and media-playback slice that follows the infrastructure foundation.

## Origin boundary

The S3 bucket remains Block Public Access enabled and has no anonymous read policy. Lambda/API Gateway must not proxy video bytes.

## Outputs

The CDK stack exposes the CloudFront distribution ID and domain name for later API/playback integration.

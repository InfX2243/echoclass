import { createSign } from 'node:crypto';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

const secretsManager = new SecretsManagerClient({});
const secretArn = () => process.env.MEDIA_SIGNING_SECRET_ARN;
const distributionDomain = () => process.env.MEDIA_DISTRIBUTION_DOMAIN;
const keyPairId = () => process.env.MEDIA_SIGNING_KEY_PAIR_ID;

let signingSecretPromise;

const normalizePrivateKey = (value) => {
  if (typeof value !== 'string') return null;

  const normalized = value.trim().replace(/\\n/g, '\n');
  const beginMatch = normalized.match(/-----BEGIN ([A-Z ]*PRIVATE KEY)-----/);
  const endMatch = normalized.match(/-----END ([A-Z ]*PRIVATE KEY)-----/);

  if (!beginMatch || !endMatch || beginMatch[1] !== endMatch[1]) return null;

  const label = beginMatch[1];
  const body = normalized
    .slice(beginMatch.index + beginMatch[0].length, endMatch.index)
    .replace(/\s+/g, '');

  if (!body) return null;

  const lines = body.match(/.{1,64}/g) ?? [];

  return [
    `-----BEGIN ${label}-----`,
    ...lines,
    `-----END ${label}-----`,
    '',
  ].join('\n');
};

const extractPrivateKey = (secretString) => {
  const rawPrivateKey = normalizePrivateKey(secretString);
  if (rawPrivateKey) return rawPrivateKey;

  try {
    const parsed = JSON.parse(secretString);
    const privateKey = normalizePrivateKey(parsed?.privateKey);
    if (privateKey) return privateKey;
  } catch {
    // Raw PEM is also supported.
  }

  throw new Error('MEDIA_SIGNING_SECRET_INVALID');
};

const getSigningSecret = async () => {
  if (!signingSecretPromise) {
    signingSecretPromise = secretsManager
      .send(new GetSecretValueCommand({ SecretId: secretArn() }))
      .then((response) => {
        if (!response.SecretString) throw new Error('MEDIA_SIGNING_SECRET_EMPTY');
        return extractPrivateKey(response.SecretString);
      });
  }

  return signingSecretPromise;
};

// CloudFront uses its own URL-safe Base64 mapping for signed URL values:
// + -> -, = -> _, / -> ~
const toCloudFrontBase64 = (value) =>
  Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/=/g, '_')
    .replace(/\//g, '~');

const createCannedPolicySignature = ({ url, expiresAt, privateKey }) => {
  const policy = JSON.stringify({
    Statement: [
      {
        Resource: url,
        Condition: { DateLessThan: { 'AWS:EpochTime': expiresAt } },
      },
    ],
  });

  const signer = createSign('RSA-SHA1');
  signer.update(policy);
  signer.end();

  return toCloudFrontBase64(signer.sign(privateKey));
};

export const createLessonPlaybackAccess = async ({ objectKey, expiresIn = 3600 }) => {
  const privateKey = await getSigningSecret();
  const expiresAtEpoch = Math.floor(Date.now() / 1000) + expiresIn;
  const url = `https://${distributionDomain()}/${objectKey
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`;

  const signature = createCannedPolicySignature({
    url,
    expiresAt: expiresAtEpoch,
    privateKey,
  });

  const playbackUrl = `${url}?Expires=${expiresAtEpoch}&Key-Pair-Id=${encodeURIComponent(
    keyPairId()
  )}&Signature=${signature}`;

  return {
    playbackUrl,
    expiresAt: new Date(expiresAtEpoch * 1000).toISOString(),
  };
};

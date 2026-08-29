import { createSign } from 'node:crypto';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

const secretsManager = new SecretsManagerClient({});
const secretArn = () => process.env.MEDIA_SIGNING_SECRET_ARN;
const distributionDomain = () => process.env.MEDIA_DISTRIBUTION_DOMAIN;
const keyPairId = () => process.env.MEDIA_SIGNING_KEY_PAIR_ID;

let signingSecretPromise;

const getSigningSecret = async () => {
  if (!signingSecretPromise) {
    signingSecretPromise = secretsManager
      .send(new GetSecretValueCommand({ SecretId: secretArn() }))
      .then((response) => {
        if (!response.SecretString) throw new Error('MEDIA_SIGNING_SECRET_EMPTY');
        const secret = JSON.parse(response.SecretString);
        if (typeof secret.privateKey !== 'string' || secret.privateKey.length === 0) {
          throw new Error('MEDIA_SIGNING_SECRET_INVALID');
        }
        return secret;
      });
  }
  return signingSecretPromise;
};

const toCloudFrontBase64 = (value) =>
  Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/=/g, '~')
    .replace(/\//g, '_');

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
  const secret = await getSigningSecret();
  const expiresAtEpoch = Math.floor(Date.now() / 1000) + expiresIn;
  const url = `https://${distributionDomain()}/${objectKey.split('/').map(encodeURIComponent).join('/')}`;
  const signature = createCannedPolicySignature({
    url,
    expiresAt: expiresAtEpoch,
    privateKey: secret.privateKey,
  });
  const playbackUrl = `${url}?Expires=${expiresAtEpoch}&Key-Pair-Id=${encodeURIComponent(keyPairId())}&Signature=${signature}`;

  return {
    playbackUrl,
    expiresAt: new Date(expiresAtEpoch * 1000).toISOString(),
  };
};

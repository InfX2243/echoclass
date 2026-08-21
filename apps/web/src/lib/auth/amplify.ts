import { Amplify } from 'aws-amplify';

import { authConfig } from './config';

let configured = false;

export function configureAmplify() {
  if (configured || !authConfig.region || !authConfig.userPoolId || !authConfig.userPoolClientId) return;

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: authConfig.userPoolId,
        userPoolClientId: authConfig.userPoolClientId,
      },
    },
  });

  configured = true;
}

export const authConfig = {
  region: import.meta.env.VITE_COGNITO_REGION?.trim() ?? '',
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID?.trim() ?? '',
  userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID?.trim() ?? '',
};

export function isCognitoConfigured() {
  return Boolean(authConfig.region && authConfig.userPoolId && authConfig.userPoolClientId);
}

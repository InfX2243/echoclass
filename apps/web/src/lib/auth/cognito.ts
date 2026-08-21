import { signIn, signOut, signUp, confirmSignUp, resendSignUpCode, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

export const cognitoAuth = {
  signIn: (username: string, password: string) => signIn({ username, password }),
  signUp: (username: string, password: string, name: string) =>
    signUp({ username, password, options: { userAttributes: { email: username, name } } }),
  confirmSignUp: (username: string, confirmationCode: string) =>
    confirmSignUp({ username, confirmationCode }),
  resendConfirmationCode: (username: string) => resendSignUpCode({ username }),
  signOut: () => signOut(),
  getCurrentUser,
  fetchAuthSession,
};

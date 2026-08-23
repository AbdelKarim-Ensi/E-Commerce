export function getAuth(): { verifyIdToken: () => Promise<never> } {
  return {
    verifyIdToken: () =>
      Promise.reject(new Error('Firebase auth not available in e2e tests')),
  };
}

export type DecodedIdToken = unknown;
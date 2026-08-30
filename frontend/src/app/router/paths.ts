export const PATHS = {
  chat: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  profileSetup: "/profile-setup",
  profile: "/profile",
} as const;

export type AppPath = (typeof PATHS)[keyof typeof PATHS];

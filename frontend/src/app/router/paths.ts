export const PATHS = {
  chat: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  profileSetup: "/profile-setup",
  profile: "/profile",
  metrics: "/metrics",
  trends: "/trends",
  medications: "/medications",
  appointments: "/appointments",
} as const;

export type AppPath = (typeof PATHS)[keyof typeof PATHS];

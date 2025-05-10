export const APP_ROUTES = {
  HOME: "/",
  CREATE: "/create",
  PROFILE: (id: string) => `/profile/${id}`,
  PREDICTORY_ID: (id: string) => `/predictory/${id}`,
} as const;

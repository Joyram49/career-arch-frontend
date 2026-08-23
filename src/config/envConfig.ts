export const envConfig = {
  devMode: process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production',
  clientLocalUrl: process.env.NEXT_PUBLIC_CLIENT_LOCAL_URL,
  clientProductionUrl: process.env.NEXT_PUBLIC_CLIENT_PRODUCTION_URL,
  siteUrl:
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
      ? process.env.NEXT_PUBLIC_CLIENT_LOCAL_URL || 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_CLIENT_PRODUCTION_URL || 'http://demourl.com',

  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? '/api/v1',
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_LOCAL_URL,
  serverApiUrl:
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
      ? `${process.env.BACKEND_LOCAL_URL}/api/v1`
      : `${process.env.BACKEND_PRODUCTION_URL}/api/v1`,
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PK,
  //   googleTagManagerID: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
};

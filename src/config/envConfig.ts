export const envConfig = {
  devMode: process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production',
  backendLocalUrl: process.env.NEXT_PUBLIC_BACKEND_LOCAL_URL,
  backendProdUrl: process.env.NEXT_PUBLIC_BACKEND_PRODUCTION_URL,
  clientLocalUrl: process.env.NEXT_PUBLIC_CLIENT_LOCAL_URL,
  clientProductionUrl: process.env.NEXT_PUBLIC_CLIENT_PRODUCTION_URL,
  siteUrl:
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
      ? process.env.NEXT_PUBLIC_CLIENT_LOCAL_URL || 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_CLIENT_PRODUCTION_URL || 'http://demourl.com',
  apiUrl:
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
      ? process.env.NEXT_PUBLIC_BACKEND_LOCAL_URL
      : process.env.NEXT_PUBLIC_BACKEND_PRODUCTION_URL,
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_LOCAL_URL,
  //   gMapApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  //   firebase: {
  //     apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  //     authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  //     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  //     storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  //     messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  //     appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
  //     measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID,
  //   },
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PK,
  //   googleTagManagerID: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
};

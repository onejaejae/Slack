import { Configurations } from '.';

export const configurations = (): Configurations => {
  const currentEnv = process.env.NODE_ENV || 'local';

  return {
    APP: {
      PORT: process.env.PORT || 8000,
      ENV: currentEnv,
      NAME: process.env.NAME || 'slack',
      BASE_URL: process.env.BASE_URL || 'http://localhost',
    },
    DB: {
      USER_NAME: process.env.USER_NAME,
      PASSWORD: process.env.PASSWORD,
      DATABASE: process.env.DATABASE,
    },
    AUTH_CONFIG: {
      COOKIE_SECRET: process.env.COOKIE_SECRET,
    },
  };
};

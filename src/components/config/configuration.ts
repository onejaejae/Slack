import { Configurations } from '.';

export const configurations = (): Configurations => {
  const currentEnv = process.env.NODE_ENV || 'local';

  return {
    APP: {
      PORT: process.env.PORT || 8081,
      ENV: currentEnv,
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

import { Configurations } from '.';

export const configurations = (): Configurations => {
  const currentEnv = process.env.NODE_ENV || 'local';

  return {
    APP: {
      PORT: process.env.PORT || 8081,
      ENV: currentEnv,
    },
  };
};

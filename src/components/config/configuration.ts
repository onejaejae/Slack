import session from 'express-session';
import { Configurations } from '.';

const MySQLStore = require('express-mysql-session')(session);

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
      DB_USER_NAME: process.env.DB_USER_NAME,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_DATABASE: process.env.DB_DATABASE,
      DB_PORT: process.env.DB_PORT || 3306,
    },
    AUTH_CONFIG: {
      COOKIE_SECRET: process.env.COOKIE_SECRET,
    },
    SERVER: {
      SESSION: {
        resave: false,
        saveUninitialized: false,
        proxy: true,
        rolling: true,
        secret: process.env.COOKIE_SECRET,
        cookie: {
          httpOnly: true,
          maxAge: parseInt(process.env.SESSION_EXPIRE || '86400000', 10),
          secure: 'auto',
        },
        store: new MySQLStore({
          host: 'localhost',
          port: process.env.DB_PORT,
          user: process.env.DB_USER_NAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          createDatabaseTable: true,
        }),
      },
    },
  };
};

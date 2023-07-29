import { SessionOptions } from 'express-session';

export interface AppConfig {
  PORT: string | number;
  ENV: string;
  NAME: string;
  BASE_URL: string;
}

export interface DBConfig {
  DB_USER_NAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_PORT: number | string;
}

export interface AuthConfig {
  COOKIE_SECRET: string;
}

export interface ServerConfig {
  SESSION: SessionOptions;
}

export interface Configurations {
  APP: AppConfig;
  DB: DBConfig;
  AUTH_CONFIG: AuthConfig;
  SERVER: ServerConfig;
}

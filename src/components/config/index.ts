export interface AppConfig {
  PORT: string | number;
  ENV: string;
  NAME: string;
  BASE_URL: string;
}

export interface DBConfig {
  USER_NAME: string;
  PASSWORD: string;
  DATABASE: string;
}

export interface AuthConfig {
  COOKIE_SECRET: string;
}

export interface Configurations {
  APP: AppConfig;
  DB: DBConfig;
  AUTH_CONFIG: AuthConfig;
}

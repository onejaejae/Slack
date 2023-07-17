export interface AppConfig {
  PORT: string | number;
  ENV: string;
}

export interface DBConfig {
  USER_NAME: string;
  PASSWORD: string;
  DATABASE: string;
}

export interface Configurations {
  APP: AppConfig;
  DB: DBConfig;
}

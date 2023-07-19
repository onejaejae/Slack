import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig, AuthConfig, Configurations, DBConfig } from '.';

@Injectable()
export class SlackConfigService {
  constructor(private readonly configService: ConfigService<Configurations>) {}

  getAppConfig(): AppConfig {
    return this.configService.getOrThrow('APP');
  }

  getDBConfig(): DBConfig {
    return this.configService.getOrThrow('DB');
  }

  getAuthConfig(): AuthConfig {
    return this.configService.getOrThrow('AUTH_CONFIG');
  }
}

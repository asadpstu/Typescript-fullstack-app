import { AppConfig } from '../types';

const config: AppConfig = {
  DEFAULT_LIMIT: 30,
  DEFAULT_PAGE: 1,
  REDIS_EXPIRE:30,
  REDIS_HOST:'redis',
  REDIS_PORT: 6379
};

export default config;  
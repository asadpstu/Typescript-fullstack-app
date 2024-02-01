interface AppConfig {
  DEFAULT_LIMIT: number;
  DEFAULT_PAGE:number;
  REDIS_EXPIRE:number;
}

const config: AppConfig = {
  DEFAULT_LIMIT: 30,
  DEFAULT_PAGE: 1,
  REDIS_EXPIRE:30
};

export default config;  
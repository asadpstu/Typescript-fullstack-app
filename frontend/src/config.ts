interface AppConfig {
    DEFAULT_LIMIT: number;
    DEFAULT_PAGE:number;
    API_BASEURL:string;
  }
  
  const config: AppConfig = {
    DEFAULT_LIMIT: 30,
    DEFAULT_PAGE: 1,
    API_BASEURL: 'http://localhost:4050/api/v1/'
  };
  
  export default config;  
export interface AppConfig {
    DEFAULT_LIMIT: number;
    DEFAULT_PAGE:number;
    REDIS_EXPIRE:number;
    REDIS_HOST: string;
    REDIS_PORT:number;
}
export interface Recipe {
    Name: string;
    url: string;
    Description : string;
    Author: string;
    Ingredients : string[]
    Method: string[]
}
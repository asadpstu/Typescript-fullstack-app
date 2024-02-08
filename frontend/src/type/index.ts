export interface Recipe {
  Name: string;
  url: string;
  Description: string;
  Author: string;
  Ingredients: string[];
  Method: string[];
}

export interface Author {
  name: string;
}

export interface AppConfig {
  DEFAULT_LIMIT: number;
  DEFAULT_PAGE: number;
  API_BASEURL: string;
}  
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

export interface AuthorCustomList {
  lists: string[];
}

export interface UniqueAuthors {
  uniqueAuthors: string[];
}

export interface FetchRecipes{
  totalPages: number;
  recipes : Recipe[];
}

export interface AddCustomList{
  author?: string;
  listName: string;
}

export interface RecipePayload {
  recipes: { Name: string }[];
}

export interface Response {
  message: string;
}

export interface FetchDataResponse<T> {
  data: T;
}
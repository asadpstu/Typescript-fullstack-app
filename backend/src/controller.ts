import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import config from './config/config';
import { redis } from './config/connection';
import { Recipe } from './types/Recipe';

const dataPath = path.resolve(__dirname, './store/recipes.json');

export const users = (req: Request, res: Response): void => {
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const recipes = JSON.parse(rawData);
    recipes.forEach((recipe: any) => {
        if (recipe.Author === null) {
          recipe.Author = 'Annonymous';
        }
      });
    const uniqueAuthors = [...new Set(recipes.map((recipe: any) => recipe.Author))];
    res.json({ uniqueAuthors });
};

export const getRecipes = (req: Request, res: Response): void => {
  const page = parseInt(req.query.page as string) || config.DEFAULT_PAGE;
  const pageSize = parseInt(req.query.limit as string) || config.DEFAULT_LIMIT;
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const recipes : Recipe[] = JSON.parse(rawData);
  let filteredRecipes  = recipes;
  const author = req.query.author as string | undefined;
  if (author) {
      filteredRecipes = recipes.filter(recipe => recipe.Author === author);
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex);

  res.json({
      recipes: paginatedRecipes,
      currentPage: page,
      totalPages: Math.ceil(filteredRecipes.length / pageSize),
  });
};

  export const createRecipeList = async (req: Request, res: Response): Promise<void> => {
    try {
      const { author, listName } = req.body as { author: string; listName: string };
      if (!author || !listName) {
        res.status(400).json({ error: 'Invalid input. Author and listName are required.' });
        return
      }
      const authorKey = `author:${author}`;
      const authorListKey = `author:${author}:list:${listName}`;
      const existingLists = await redis.smembers(authorKey);
      if (existingLists.includes(authorListKey)) {
        res.status(400).json({ error: 'A recipe list with the same name already exists for this author.' });
        return
      }
      await redis.sadd(authorKey, authorListKey);   
      res.json({ message: 'Recipe list created successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };  

export const getRecipeLists = async (req: Request, res: Response): Promise<void> => {
  try {
    const { author } = req.params;
    if (!author) {
      res.status(400).json({ error: 'Author is required.' });
      return
    }
    const authorKey = `author:${author}`;
    const existingLists = await redis.smembers(authorKey);
    res.json({ lists: existingLists });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const addRecipesToList = async (req: Request, res: Response): Promise<void> => {
  try {   
    const { author, listName } = req.params;
    const { recipes } = req.body as { recipes: Recipe[] };
    if (!author || !listName || !recipes || !Array.isArray(recipes) || recipes.length === 0) {
      res.status(400).json({ error: 'Invalid input. Author, listName, and recipes are required.' });
      return;
    }
    const authorKey = `author:${author}`;
    const authorListKey = `author:${author}:list:${listName}`;  
    const existingLists = await redis.smembers(authorKey);
    if (!existingLists.includes(authorListKey)) {
      res.status(404).json({ error: 'Please create a Custom list.' });
      return;
    }
    recipes.map(async (recipe)=>{
      await redis.sadd(authorListKey, recipe.Name);  
    })
    res.json({ message: 'Recipes added to the list successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getRecipeListDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { author, listName } = req.params;
    const authorListKey = `author:${author}:list:${listName}`;
    const recipes = await redis.smembers(authorListKey);
    const recipeStoreData = fs.readFileSync(dataPath, 'utf-8');
    const recipesList : Recipe[] = JSON.parse(recipeStoreData);
    const recipeDetails = await Promise.all(
      recipes.map(async (recipeName) => {
        const filteredRecipe = recipesList.find((recipe) => recipe.Name === recipeName);
        return filteredRecipe
      })
    )
    res.json({ authorListKey, recipes: recipeDetails});
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
import { Router } from 'express';
import { 
    users,
    getRecipes,
    createRecipeList,
    getRecipeLists,
    addRecipesToList,
    getRecipeListDetails 
} from './controller';

const router = Router();

router.get('/users', users);   
router.get('/recipes', getRecipes); 
router.post('/list', createRecipeList); 
router.get('/lists/:author', getRecipeLists); 
router.post('/lists/:author/:listName/recipes', addRecipesToList); 
router.get('/author/:author/list/:listName', getRecipeListDetails); 

export default router;

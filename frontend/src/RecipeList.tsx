import React, { useState, useEffect } from 'react';
import AppConfig from './config';
import { Author, Recipe } from './type/interface';

const RecipeList: React.FC<{ author?: string, listName: string, customList: Author[] }> = ({ author, listName, customList }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState<number>(AppConfig.DEFAULT_PAGE);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loadMore, setLoadMore] = useState(false);
  const LIMIT = AppConfig.DEFAULT_LIMIT

  useEffect(() => {
    if (loadMore) {
      setTimeout(() => {
        fetchRecipes();
      }, 2000)
    }
  }, [loadMore]);

  useEffect(() => {
    setRecipes([]);
    setLoadMore(false);
    setPage(1);
    fetchRecipes();
  }, [author, listName])



  const fetchRecipes = () => {
    let url = `${AppConfig.API_BASEURL}/recipes?limit=${LIMIT}&page=${page}`
    if (author && listName == '') {
      url = `${AppConfig.API_BASEURL}/recipes?author=${author}&limit=${LIMIT}&page=${page}`
    }
    else if (author && listName !== '') {
      url = `${AppConfig.API_BASEURL}/author/${author}/list/${listName}`
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (page == 1) setRecipes([]);
        setTotalPages(data.totalPages);
        setRecipes((prevRecipes) => [...prevRecipes, ...data.recipes])
      })
      .catch((error) => console.error('Error fetching recipes:', error));
    setLoadMore(false);
  };

  const handleCheckboxChange = (listName: string, recipe: Recipe) => {
    fetch(`${AppConfig.API_BASEURL}/lists/${author}/${listName}/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipes: [
          { "Name": recipe.Name },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(`${data.message}`);
      })
      .catch((error) => {
        alert(`Error storing recipes.`);
      });
  }

  const handleLoadMore = () => {
    setLoadMore(true);
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <React.Fragment>
      <div>
        {recipes && recipes.length === 0 &&
          <React.Fragment>
            <div className='no-data'>No Item found!</div>
          </React.Fragment>

        }
        {recipes.map((recipe) => (
          <div key={Math.random()} className="card mt-2 p-2">
            <div key={Math.random()} className='recipe-title'>{recipe.Name}</div>
            <p key={Math.random()}>
              {recipe.Description}
              <span className='p-2' key={Math.random()}>
                <a href={recipe.url} target="_blank" rel="noopener noreferrer">
                  Read More
                </a>
              </span>
              <div>
                {
                  customList.length > 0 ?
                    <div className='add-custom-label'>
                      Add recipe to list
                    </div>
                    :
                    <div className='add-custom-label'>
                      No list added yet!
                    </div>

                }
                {
                  customList.length > 0  && customList.map((each) => {
                      return (
                        <span className="radio-item" key={Math.random()}>
                          <label>
                            <input type="radio" id={`${recipe.Name}_${each.name}`} className="radio-item-gap" onClick={() => handleCheckboxChange(each.name.split(':')[3], recipe)}/>
                            {each.name.split(':')[3]}
                          </label>
                        </span>
                      );
                  })
                }
              </div>
            </p>
          </div>
        ))}
        {loadMore && <div className='text-center mt-3 load-more'> Loading...</div>}
        <br />
        <br />
        {page !== totalPages
          && totalPages !== 0
          && !loadMore
          && totalPages
          &&
          <div className="text-center mt-3 fixed-button">
            <button className="btn btn-primary" onClick={handleLoadMore}>
              {loadMore ? 'Loading...' : 'Load More'}
            </button>
          </div>
        }
      </div>
    </React.Fragment>
  );
};

export default RecipeList;
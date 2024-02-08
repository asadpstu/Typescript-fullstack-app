import React, { useState, useEffect } from 'react';
import RecipeList from './RecipeList';
import AppConfig from '../config';
import { Author } from '../type';

const MyFavourite: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [customListName, setCustomListName] = useState('');
  const [customList, setCustomList] = useState<Author[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [listName, setListName] = useState<string>('');
  const [selectedlistName, setSelectedListName] = useState<string>('');
  const [message, setMessage] = useState<string>('Add');

  const resetCurrentState = () => {
    window.location.reload();
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAuthorName = event.target.value;
    const selectedAuthor = authors.find((author) => author.name === selectedAuthorName);
    setSelectedAuthor(selectedAuthor || null);
    setListName('');
  };

  const handleCustomListChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target
    setListName(value.split(':')[3])
    setSelectedListName(value)
  };

  const loadCustomList = () : void=> {
    fetch(`${AppConfig.API_BASEURL}/lists/${selectedAuthor?.name}`)
      .then((response) => response.json())
      .then((data) => {
        const customList: Author[] = data.lists.map((name: string) => ({ name }));
        setCustomList(customList);
      })
      .catch((error) => console.error('Error fetching authors:', error));
  }

  const addCustomList = () : void => {
    if (customListName.trim() === '') return;
    fetch(`${AppConfig.API_BASEURL}/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        author: selectedAuthor?.name,
        listName: customListName,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setMessage('Added!')
        setCustomListName('');
        loadCustomList();
        setTimeout(() => {
          setMessage('Add');
        }, 2000)
      })
      .catch(() => {
        setMessage('Failed!')
        setTimeout(() => {
          setMessage('Add');
        })
      });
  };

  useEffect(() => {
    fetch(`${AppConfig.API_BASEURL}/users`)
      .then((response) => response.json())
      .then((data) => {
        const authorList = data.uniqueAuthors.map((name: string) => ({ name }));
        setAuthors(authorList);
        if (authorList.length > 0) {
          setSelectedAuthor(authorList[0]);
        }
      })
      .catch((error) => console.error('Error fetching authors:', error));
  }, []);

  useEffect(() => {
    loadCustomList();
  }, [selectedAuthor])

  return (
    <React.Fragment>
      <div className='header'>
        <select
          value={selectedAuthor ? selectedAuthor.name : ''}
          onChange={handleSelectChange}
          className="my-select"
        >
          <option value="" disabled>
            -Author-
          </option>
          {authors.map((author) => (
            <option key={Math.random()} value={author.name}>
              {author.name}
            </option>
          ))}
        </select>
        <span className="my-input-space">
          <input
            type="text"
            placeholder="Add new list"
            className="my-input"
            value={customListName}
            onChange={(e) => setCustomListName(e.target.value)}
          />
          <button type="button" className="my-button" onClick={addCustomList}>
            {message}
          </button>
        </span>

        <select
          onChange={handleCustomListChange}
          className="my-select"
          value={selectedlistName ? selectedlistName : ''}
        >
          <option value="" disabled>
            {customList.length > 0 ? '- My list -' : '- No list -'}
          </option>
          {customList.map((each) => (
            <option key={Math.random()} value={each.name}>
              {each.name.split(':')[3]}
            </option>
          ))}
        </select>
        <span className='reset ml-5' onClick={resetCurrentState}>
          [RESET]
        </span>
      </div>
      <RecipeList author={selectedAuthor?.name} listName={listName} customList={customList} />
    </React.Fragment>
  );
};

export default MyFavourite;

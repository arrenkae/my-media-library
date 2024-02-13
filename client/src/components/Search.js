import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useContext, memo } from "react";
import { Paper, InputBase, Button, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
import SearchData from "./SearchData"
import { LibraryContext } from "./Library";
import { types } from "./Library";
import _ from 'lodash';

const Search = (props) => {
  const type = useSelector(state => state.media.type);
  const { searchResults, setSearchResults } = useContext(LibraryContext);
  const [query, setQuery] = useState('');
  const [error, setError] = useState();

  useEffect(()=>{
    setError();
    setQuery('');
  }, [type]);

  const handleQuery = (e) => {
    setQuery(e.target.value);
  }

  const handleSearch = () => {
    if (query) {
      search();
    } else {
      showError('Search field is empty');
    }
  }

  const handleClear = (e) => {
    setSearchResults([]);
    setQuery('');
  }

  const showError = (message) => {
    setError(message);
    setTimeout(() => { setError() }, 8000);
  }

  const search = async() => {
    setSearchResults([]);
    setError();
    try {
        const response = await axios.get(types[type].searchLink + query + '&' + types[type].api_key);
        if (response.status === 200) {
          setSearchResults({query, results: response.data[types[type].searchResults]});
          if (response.data[types[type].searchResults].length === 0) {
            showError('No media found');
          } else {
            setQuery('');
          }
        };
    } catch (error) {
        showError('Search error');
    }
  };

  return (
    <>
        <Paper
          component="form"
          sx={{ p: '2px 4px', m: 5, display: 'flex', alignItems: 'center', maxWidth: 400 }}
          >
          <SearchIcon sx={{ ml: 1 }} />
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            inputProps={{ 'aria-label': 'search new media' }}
            onChange={handleQuery}
            value={query}
          />
          <Button variant="text" onClick={handleSearch}>Search</Button>
          <Button variant="text" onClick={handleClear}>Clear</Button>
        </Paper>
        {error ? <Alert variant="outlined" sx={{ ml: 5, maxWidth: 400 }} severity="error">{error}</Alert> : null}
        {searchResults ? <SearchData /> : null}
    </>
  );
};

export default memo(Search);
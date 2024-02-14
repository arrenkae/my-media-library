import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useContext, memo } from "react";
import { Paper, InputBase, Button, Alert, Typography, Stack } from '@mui/material';
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
    setTimeout(() => { setError() }, 5000);
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
    <Stack spacing={2} direction="column" alignItems="flex-start" sx={{ m: 5 }}>
        <Typography id="search-header" variant="h6" color="textSecondary">
            Search for new {types[type].typename}
        </Typography>
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', maxWidth: { xs: '90%', sm: 400 }, }}
          >
          <SearchIcon sx={{ ml: 1 }} />
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            inputProps={{ 'aria-label': 'search new media' }}
            onChange={handleQuery}
            value={query}
          />
          <Button variant="text" type="submit" onClick={(e) => {
            e.preventDefault();
            handleSearch();
          }}>Search</Button>
          <Button variant="text" onClick={handleClear}>Clear</Button>
        </Paper>
        {error ? <Alert variant="outlined" sx={{ maxWidth: 380 }} severity="error">{error}</Alert> : null}
        {searchResults ? <SearchData /> : null}
    </Stack>
  );
};

export default memo(Search);
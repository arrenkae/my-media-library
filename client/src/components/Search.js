import { useState, useEffect, useContext, memo } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Paper, InputBase, Button, IconButton, Alert, Typography, Stack, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import axios from "axios";
import SearchData from "./SearchData"
import { LibraryContext, types } from "./Library";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Search = (props) => {
  const { type, search } = useContext(LibraryContext);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  
  const navigate = useNavigate();

  useEffect(()=>{
    if (query) {
      getSearchResults();
    }
  }, []);

  useEffect(()=>{
    setError();
    setSearchResults([]);
  }, [type]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchResults([]);
    setError();
    if (query) {
      {/* Adds search params to the url */}
      navigate(`/library/${type}/search?q=${encodeURIComponent(query)}`);
      getSearchResults();
    } else {
      showError('Search field is empty');
    }
  }

  {/* Navigating back to main library/type route hides the search results */}
  const handleClear = (e) => {
    navigate(`/library/${type}`);
  }

  {/* Search error displayed directly under the search results for convenience instead of opening the snackbar */}
  const showError = (message) => {
    setError(message);
    setTimeout(() => { setError() }, 5000);
  }

  const getSearchResults = async() => {
    try {
        const response = await axios.get(`${BASE_URL}/search/${type}/${query}`);
        if (response.status === 200) {
          setSearchResults(response.data.results);
          setQuery('');
        }
    } catch (error) {
      setError(error.response.data.msg ? error.response.data.msg : error.message);
    }
  };

  return (
    <>
      <Stack spacing={2} direction="column" alignItems="flex-start" sx={{ m: 5 }}>
          <Typography id="search-header" variant="h6" color="textSecondary">
              Search for new {types[type]?.typename}
          </Typography>
          {/* Search field */}
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', maxWidth: { xs: '90%', sm: 400 }, }}
            >
            <SearchIcon sx={{ ml: 1 }} />
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              inputProps={{ 'aria-label': 'search new media' }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="text" type="submit" onClick={handleSearch}>Search</Button>
            <Tooltip title="Clear" placement="top">
              <IconButton aria-label="clear-button" color='primary' size="small" onClick={handleClear}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Paper>
          {error ? <Alert variant="outlined" sx={{ maxWidth: 380 }} severity="error">{error}</Alert> : null}
      </Stack>
      {(search && searchResults.length > 0) ? <SearchData searchResults={searchResults} /> : null}
    </>
  );
};

export default memo(Search);
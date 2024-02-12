import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Paper, InputBase, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
import SearchData from "./SearchData"

const API_KEY = process.env.REACT_APP_API_KEY;

const Search = (props) => {
  const [searchResults, setsearchResults] = useState([]);
  const [query, setQuery] = useState();

  const handleQuery = (e) => {
    setQuery(e.target.value);
  }

  const handleSearch = () => {
    if (query) {
      search();
    }
  }

  const handleClear = (e) => {
    setsearchResults([]);
    setQuery('');
  }

  const search = async() => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/tv?query=${query}&api_key=${API_KEY}`);
        if (response.status === 200) {
          setsearchResults(response.data.results);
          setQuery('');
        };
    } catch (error) {
        console.log(error.message);
    }
  };

  return (
    <>
        <Paper
          component="form"
          sx={{ p: '2px 4px', m: 5, display: 'flex', alignItems: 'center', width: 400 }}
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
        <SearchData searchResults={searchResults}/>
    </>
  );
};

export default Search;
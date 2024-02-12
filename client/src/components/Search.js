import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useContext, memo } from "react";
import { Paper, InputBase, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
import SearchData from "./SearchData"
import { LibraryContext } from "./Library";
import { types } from "./Library";
import _ from 'lodash';

const Search = (props) => {
  const type = useSelector(state => state.media.type);
  const { searchResults, setSearchResults } = useContext(LibraryContext);
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
    setSearchResults([]);
    setQuery('');
  }

  const search = async() => {
    try {
        const response = await axios.get(types[type].searchLink + query + '&' + types[type].api_key);
        if (response.status === 200) {
          setSearchResults(response.data[types[type].searchResults]);
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
        {searchResults ? <SearchData searchResults={searchResults}/> : null}
    </>
  );
};

export default memo(Search);
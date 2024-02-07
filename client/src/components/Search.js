import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { searchMedia, resetSearch, resetMedia } from "../features/media/mediaSlice";
import Details from "./Details";
import SearchData from "./SearchData"

const Search = (props) => {
  const search = useSelector(state => state.media.search);
  const media = useSelector(state => state.media.media)
  const loadStatus = useSelector(state => state.media.load);
  const queryRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(resetMedia());
    dispatch(resetSearch());
  }, [])

  const renderSearch = search.map(element => <SearchData data={element} />);

  return (
    <>
      <div>
          <h2>Search results</h2>
          <input type="text" ref={queryRef} />
          <button onClick={() => dispatch(searchMedia(queryRef.current.value))}>Search</button>
          { Object.keys(media).length > 0 ? <Details /> : null }
          { loadStatus === 'succeded' ? renderSearch : loadStatus === 'loading' ? ' Loading...' : ' Something went wrong' }
      </div>
    </>
  );
};

export default Search;
import { useSelector, useDispatch } from "react-redux";
import { useRef, useEffect, cloneElement } from "react";
import { searchMedia, resetSearch } from "../features/media/mediaSlice";
import SearchData from "./SearchData"

const Search = (props) => {
  const search = useSelector(state => state.media.search);
  const loadStatus = useSelector(state => state.media.load);
  const queryRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(resetSearch());
  }, [])

  const renderSearch = search.map(element => <SearchData media={element} />);

  return (
    <>
      <div>
          <h2>Search results</h2>
          <input type="text" ref={queryRef} />
          <button onClick={() => dispatch(searchMedia(queryRef.current.value))}>Search</button>
          { loadStatus === 'succeded' ? renderSearch : loadStatus === 'loading' ? ' Loading...' : ' Something went wrong' }
      </div>
    </>
  );
};

export default Search;
import { useSelector, useDispatch } from "react-redux";
import { useRef, useEffect } from "react";
import { searchMedia, fetchMediaDetails, resetSearch } from "../features/media/mediaSlice";
import Details from './Details';

const Search = (props) => {
  const searchResults = useSelector(state => state.media.search);
  const loadStatus = useSelector(state => state.media.load);
  const queryRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(resetSearch());
}, [])

  if(loadStatus === 'loading') return <p>Loading...</p>
  if(loadStatus === 'failed') return <p>Oops! Something went wrong</p>

  const renderSearch = searchResults
    .map(result => {
      return (
        <div key={result.id}>
          <h4>{result.name}</h4>
          <img src={'https://image.tmdb.org/t/p/w200' + result.poster_path} alt={result.name + ' poster'} />
          <p>{result.overview}</p>
          <button onClick={() => dispatch(fetchMediaDetails(result.id))}> + </button>
        </div>
      );
    });

  return (
    <>
      <Details/>
      <div>
          <h2>Search results</h2>
          <input type="text" ref={queryRef} />
          <button onClick={() => dispatch(searchMedia(queryRef.current.value))}>Search</button>
          {renderSearch}
      </div>
    </>
  );
};

export default Search;
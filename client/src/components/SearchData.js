import { memo } from "react";
import { useDispatch } from "react-redux";
import { fetchMedia } from "../features/media/mediaSlice";
import { useSelector } from "react-redux";

const SearchData = ({data}) => {
    const library = useSelector(state => state.media.library);
    const dispatch = useDispatch();

    return (
    <>
        <div key={data.id}>
          <h4>{data.name}</h4>
          { data.poster_path? <img src={'https://image.tmdb.org/t/p/w200' + data.poster_path} alt={data.name + ' poster'} /> : '[No image]'}
          <p>{data.overview}</p>
          <button onClick={() => {
            dispatch(fetchMedia(data.id));
          }}>{library.some(element => element.api_id === data.id) ? 'Update' : 'Add to list'}</button>
        </div>
    </>)
}

export default memo(SearchData);
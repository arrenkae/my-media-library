import { useContext, memo } from "react";
import { useDispatch } from "react-redux";
import { userMedia, deleteMedia, editMedia } from "../features/media/mediaSlice";
import { AuthContext } from '../App';

const LibraryData = ({data}) => {
    const {user} = useContext(AuthContext);
    const dispatch = useDispatch();

    return (
    <>
        <h2>{data.title}</h2>
        { data.image ? <img src={'https://image.tmdb.org/t/p/w200' + data.image} alt={data.title + ' poster'} /> : '[No image]' }
        { data.description ? <p>{data.description}</p> : null }
        <p>{ data.released ? data.release_date ? 'Release date: ' + new Date(data.release_date).toDateString().slice(4) : 'Release date: unknown' : 'Not yet released' }</p>
        { data.update_date ? <p>Latest release: {new Date(data.update_date).toDateString().slice(4)}</p> : null }
        { data.status ? <h4>Status: {data.status}</h4> : null }
        { data.progress ? <h5>Progress: {data.progress} / {data.progress_max}</h5> :  null }
        { data.rating ? <h5>Rating: {data.rating}</h5> : null }
        <button onClick={() => dispatch(editMedia(data))}>Edit</button>
        <button onClick={() => {
            dispatch(deleteMedia(data.id));
            dispatch(userMedia(user.id));
        }}>Delete</button>
    </>)
}

export default memo(LibraryData);
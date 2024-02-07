import { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { userMedia, editMedia, resetMedia } from "../features/media/mediaSlice";
import Details from './Details';
import { AuthContext } from '../App';

const Library = (props) => {
    const {user} = useContext(AuthContext);
    const media = useSelector(state => state.media.media);
    const library = useSelector(state => state.media.library);
    const dispatch = useDispatch();

    useEffect(()=>{
        console.log(library);
        dispatch(userMedia(user.id));
        dispatch(resetMedia());
    }, [])

    const edit = (media) => {
        dispatch(editMedia(media));
    }

    const renderLibrary = 
    <>
        <h1>Your Library</h1>
        { Object.keys(media).length > 0 ? <Details /> : null }
        {library.map(media => {
        return (
            <div key={media.id}>
                <h2>{media.title}</h2>
                <img src={'https://image.tmdb.org/t/p/w200' + media.image} alt={media.title + ' poster'} />
                { media.status ? <h4>Status: {media.status}</h4> : null }
                { media.progress ? <h5>Progress: {media.progress} / {media.progress_max}</h5> :  null }
                { media.rating ? <h5>Rating: {media.rating}</h5> : null }
                <button onClick={() => edit(media)}>Edit</button>
            </div>
        );
        })}
    </>

    return library.length > 0 ? renderLibrary : <h2>Your library is empty!</h2>;
};

export default Library;
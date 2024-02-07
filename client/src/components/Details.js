import { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { saveMedia, resetMedia } from "../features/media/mediaSlice";
import { AuthContext } from '../App';

const Details = () => {
    const media = useSelector(state => state.media.media);
    const {user} = useContext(AuthContext);
    const [status, setStatus] = useState(media.status ? media.status : 'Backlog');
    const [progress, setProgress] = useState(media.progress ? media.progress : 0);
    const [rating, setRating] = useState(media.rating ? media.rating : 0);
    const [errorMsg, setErrorMsg] = useState();
    const loadStatus = useSelector(state => state.media.load);
    
    const dispatch = useDispatch();

    const releasedOptions =
        <>
        <option value='Active'>Active</option>
        <option value='On-hold'>On-hold</option>
        <option value='Dropped'>Dropped</option>
        <option value='Completed'>Completed</option>
        </>

    const releasedValues =
        <>
        <p>Progress: <input type="number" name="progress" onChange={(e) => setProgress(e.target.value)} min="1" max={media.progress_max} value={
            status === 'completed' ? media.progress_max : progress } /> / {media.progress_max} </p>
        <p>Rating: <input type="number" name="rating" onChange={(e) => setRating(e.target.value)} min="1" max="10" value={rating} /><br /></p>
        </>

    const add = async() => {
        dispatch(saveMedia({...media,
            user_id: user.id,
            status,
            progress,
            rating
        }));
        if (loadStatus === 'succeded') {
            dispatch(resetMedia())
        } else if (loadStatus === 'failed') {
            showError('Something went wrong');
        };
    }

    const showError = (message) => {
        setErrorMsg(message);
        setTimeout(() => { setErrorMsg('') }, 3000);
    }

    return (
        <div>
            <h2>{media.title}</h2>
            <img src={media.image} alt={media.title + ' poster'} />
            <p>{media.description}</p>
            <h5>{ media.released ? media.release_date ? 'Release date: ' + media.release_date : 'Release date: unknown' : 'In production' }</h5>
            { media.update_date ? <h5>Latest release: {media.update_date}</h5> : '' }
            <select name="status" onChange={(e) => setStatus(e.target.value)}>
                <option value='Backlog'>Backlog</option>
                { media.released ? releasedOptions : '' }
            </select>
            { media.released ? releasedValues : '' }
            <button onClick={add}>Save</button>
            <div className="errorMsg">{errorMsg}</div>
        </div>
    );
};

export default Details;
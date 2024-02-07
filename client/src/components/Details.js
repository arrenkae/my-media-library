import { useState, useEffect, useContext, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { saveMedia, resetMedia, fetchMedia } from "../features/media/mediaSlice";
import { AuthContext } from '../App';

const Details = (props) => {
    const media = useSelector(state => state.media.media)
    const {user} = useContext(AuthContext);
    const [status, setStatus] = useState('Backlog');
    const [progress, setProgress] = useState(0);
    const [rating, setRating] = useState(0);
    const loadStatus = useSelector(state => state.media.load);
    
    const dispatch = useDispatch();

    useEffect(()=>{
        if (media.api_id) dispatch(fetchMedia(media.api_id));
    }, [])

    useEffect(()=>{
        if (media.status) setStatus(media.status);
        if (media.progress) setProgress(media.progress);
        if (media.rating) setRating(media.rating);
    }, [media])


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

    const save = () => {
        dispatch(saveMedia({...media,
            user_id: user.id,
            status,
            progress,
            rating
        }));
        dispatch(resetMedia());
    }

    return  (
        <div>
            <h2>{media.title}</h2>
            <img src={media.image} alt={media.title + ' poster'} />
            <p>{media.description}</p>
            <h5>{ media.released ? media.release_date ? 'Release date: ' + media.release_date : 'Release date: unknown' : 'In production' }</h5>
            { media.update_date ? <h5>Latest release: {media.update_date}</h5> : null }
            <select name="status" onChange={(e) => setStatus(e.target.value)} value={status}>
                <option value='Backlog'>Backlog</option>
                { media.released ? releasedOptions : null }
            </select>
            { media.released ? releasedValues : null }
            <button onClick={save}>Save</button>
            <div className="errorMsg">{ loadStatus === 'failed' ? 'Something went wrong' : null }</div>
        </div>
    );
};

export default memo(Details);
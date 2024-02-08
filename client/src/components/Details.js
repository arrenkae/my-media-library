import { useState, useContext, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { saveMedia } from "../features/media/mediaSlice";
import { AuthContext } from '../App';

const Details = ({media, reset}) => {
    const {user} = useContext(AuthContext);
    const [status, setStatus] = useState(media.status ? media.status : 'Backlog');
    const [progress, setProgress] = useState(media.progress ? media.progress : 0);
    const [rating, setRating] = useState(media.rating ? media.rating : 0);
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
            status === 'Completed' ? media.progress_max : progress } /> / {media.progress_max} </p>
        <p>Rating: <input type="number" name="rating" onChange={(e) => setRating(e.target.value)} min="1" max="10" value={rating} /><br /></p>
        </>

    const save = () => {
        dispatch(saveMedia({...media,
            user_id: user.id,
            status,
            progress,
            rating
        }));
        reset(null);
    }

    return  (
        <div>
            <h2>{media.title}</h2>
            <img src={media.image} alt={media.title + ' poster'} />
            <p>{media.description}</p>
            <p>{ media.released ? media.release_date ? 'Release date: ' + media.release_date : 'Release date: unknown' : 'In production' }</p>
            { media.update_date ? <p>Latest release: {media.update_date}</p> : null }
            <select name="status" onChange={(e) => setStatus(e.target.value)} value={status}>
                <option value='Backlog'>Backlog</option>
                { media.released ? releasedOptions : null }
            </select>
            { media.released ? releasedValues : null }
            <button onClick={save}>Save</button>
            <button onClick={() => reset(null)}>Close</button>
            <div className="errorMsg">{ loadStatus === 'failed' ? 'Something went wrong' : null }</div>
        </div>
    );
};

export default memo(Details);
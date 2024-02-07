import { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMedia } from "../features/media/mediaSlice";
import { AuthContext } from '../App';

const Details = () => {
    const media = useSelector(state => state.media.media);
    const {user} = useContext(AuthContext);
    const dispatch = useDispatch();
    
    if (Object.keys(media).length != 0) {
        return (
            <div>
                <h2>{media.title}</h2>
                <img src={media.image} alt={media.title + ' poster'} />
                <p>{media.description}</p>
                <button onClick={() => {
                    if (user) {
                        dispatch()
                    }
                }}>Add to list</button>
            </div>
        );
    }
};

export default Details;
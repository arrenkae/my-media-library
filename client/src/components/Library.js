import { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { userMedia } from "../features/media/mediaSlice";
import Details from './Details';
import LibraryData from './LibraryData';
import { AuthContext } from '../App';

const Library = (props) => {
    const {user} = useContext(AuthContext);
    const library = useSelector(state => state.media.library);
    const media = useSelector(state => state.media.media)
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(userMedia(user.id));
    }, [])

    const renderLibrary = 
    <>
        <h1>Your Library</h1>
        { media ? <Details /> : null }
        {library.map(element =>
            <div key={element.id}>
                <LibraryData media={element} />
            </div>
        )};
    </>

    return library.length > 0 ? renderLibrary : <h2>Your library is empty!</h2>;
};

export default Library;
import { useState, useEffect, useContext, memo } from "react";
import { useDispatch } from "react-redux";
import { userMedia, deleteMedia } from "../features/media/mediaSlice";
import { AuthContext } from '../App';
import axios from "axios";
import Details from "./Details";

const API_KEY = process.env.REACT_APP_API_KEY;

const LibraryData = ({media}) => {
    const [updatedMedia, setUpdatedMedia] = useState(media);
    const [editing, setEditing] = useState(null);
    const {user} = useContext(AuthContext);
    const dispatch = useDispatch();

    useEffect(()=>{
        fetchNewMedia().then(data => setUpdatedMedia({...media, ...data}));
    }, [])

    const fetchNewMedia = async() => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/tv/${media.api_id}?api_key=${API_KEY}`);
            if (response.status === 200) {
              return {
                api_id: response.data.id,
                title: response.data.name,
                type: 'tv',
                image: `https://image.tmdb.org/t/p/w200${response.data.poster_path}`,
                description: response.data.overview,
                released: response.data.status !== 'In Production',
                progress_max: response.data.number_of_episodes,
                release_date: response.data.first_air_date,
                update_date: response.data.last_air_date
              };
            };
        } catch (error) {
            console.log(error.message);
        }
    }

    const renderLibraryData = 
        <div key={updatedMedia.id}>
            <h2>{updatedMedia.title}</h2>
            { updatedMedia.image ? <img src={'https://image.tmdb.org/t/p/w200' + updatedMedia.image} alt={updatedMedia.title + ' poster'} /> : '[No image]' }
            { updatedMedia.description ? <p>{updatedMedia.description}</p> : null }
            <p>{ updatedMedia.released ? updatedMedia.release_date ? 'Release date: ' + updatedMedia.release_date : 'Release date: unknown' : 'Not yet released' }</p>
            { updatedMedia.update_date ? <p>Latest release: {updatedMedia.update_date}</p> : null }
            { updatedMedia.status ? <h4>Status: {updatedMedia.status}</h4> : null }
            { updatedMedia.progress ? <h5>Progress: {updatedMedia.progress} / {updatedMedia.progress_max}</h5> :  null }
            { updatedMedia.rating ? <h5>Rating: {updatedMedia.rating}</h5> : null }
            <button onClick={() => setEditing(updatedMedia)}>Edit</button>
            <button onClick={() => {
                dispatch(deleteMedia(updatedMedia.id));
                dispatch(userMedia(user.id));
            }}>Delete</button>
        </div>

    return editing ? <Details media={editing} reset={setEditing} /> : renderLibraryData;
}

export default memo(LibraryData);
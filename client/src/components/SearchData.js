import { useState, memo } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Details from "./Details";

const API_KEY = process.env.REACT_APP_API_KEY;

const SearchData = ({media}) => {
    const [editing, setEditing] = useState(null);
    const library = useSelector(state => state.media.library);

    const fetchNewMedia = async() => {
      try {
          const response = await axios.get(`https://api.themoviedb.org/3/tv/${media.id}?api_key=${API_KEY}`);
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

    const existingMedia = library.find(element => element.api_id === media.id);

    return (
      editing ?
      <Details media={existingMedia ? {...editing, ...existingMedia} : editing} reset={setEditing} />
      : media ? 
        <div key={media.id}>
          <h2>{media.name}</h2>
          { media.poster_path ? <img src={'https://image.tmdb.org/t/p/w200' + media.poster_path} alt={media.name + ' poster'} /> : '[No image]'}
          <p>{media.overview}</p>
          <button onClick={() => fetchNewMedia().then(data => setEditing(data))}>{existingMedia ? 'Update' : 'Add to list'}</button>
        </div>
      : null
    );
}

export default memo(SearchData);
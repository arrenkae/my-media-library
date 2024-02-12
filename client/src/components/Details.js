import { useEffect, useState, useContext, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { saveMedia, userMedia } from "../features/media/mediaSlice";
import { Modal, Box, Typography, Fab, InputLabel, MenuItem, FormControl, Select, Rating, Slider, Stack, Input } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { LibraryContext } from "./Library";
import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Details = (props) => {
    const { detailsFetchId, openDetails, handleCloseDetails } = useContext(LibraryContext);
    const library = useSelector(state => state.media.library);
    const [media, setMedia] = useState();
    const [status, setStatus] = useState('Backlog');
    const [progress, setProgress] = useState(0);
    const [rating, setRating] = useState(0);
    
    const dispatch = useDispatch();

    useEffect(()=>{
        fetchMedia()
        .then(data => {
            const existingMedia = library.find(element => element.api_id === data.api_id)
            if (existingMedia) {
                setMedia({...existingMedia, ...data});
                setStatus(existingMedia.status);
                setProgress(existingMedia.progress);
                setRating(existingMedia.rating)
            } else {
                setMedia(data);
            };
        })
    }, [])

    const fetchMedia = async() => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/tv/${detailsFetchId}?api_key=${API_KEY}`);
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
    };

    const save = () => {
        dispatch(saveMedia({...media,
            status,
            progress,
            rating
        }))
        .then(() => dispatch(userMedia()))
        .then(() => handleCloseDetails());
    }

    const handleSelect = (e) => {
        setStatus(e.target.value);
        if (e.target.value === 'Completed') {
            setProgress(media.progress_max);
        } else {
            setProgress(media.progress);
        }
    };

    const handleSliderChange = (e) => {
        setProgress(e.target.value);
    }

    if (media) return  (
        <Modal
            open={openDetails}
            onClose={handleCloseDetails}
            aria-labelledby="media details"
            >
            <Box sx={style}>
                <Typography id="modal-title" variant="h4" gutterBottom>
                    {media.title}
                </Typography>
                <Typography id="release-date" variant="h6">
                    { media.released ? media.release_date ? 'Release date: ' + media.release_date : 'Release date: unknown' : 'In production' }
                </Typography>
                <Typography id="latest-release-date" variant="h6" gutterBottom>
                    { media.update_date ? 'Latest release: ' + media.update_date : null }
                </Typography>
                <Typography id="modal-description" variant="body2" gutterBottom>
                    {media.description}
                </Typography>
                <FormControl sx={{ m: 1, mt: 2, minWidth: 120 }} size="small">
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                        labelId="status-select-label"
                        id="status-select"
                        value={status}
                        label="Status"
                        onChange={handleSelect}
                        >
                        <MenuItem value='Backlog'>Backlog</MenuItem>
                        <MenuItem value='Active'>Active</MenuItem>
                        <MenuItem value='On-hold'>On-hold</MenuItem>
                        <MenuItem value='Dropped'>Dropped</MenuItem>
                        <MenuItem value='Completed'>Completed</MenuItem>
                    </Select>
                </FormControl>
                <Rating
                    sx={{ m: 3 }}
                    name="rating"
                    value={rating}
                    precision={0.5}
                    onChange={(e, newValue) => {
                        setRating(newValue);
                    }}
                />
                <Typography id="input-slider" gutterBottom>
                        Progress: {progress} / {media.progress_max}
                </Typography>
                <Slider
                    value={progress}
                    onChange={handleSliderChange}
                    max={media.progress_max}
                    valueLabelDisplay="auto"
                    aria-labelledby="input-slider"
                />
                <Fab color="primary" aria-label="save" onClick={save}>
                    <SaveIcon />
                </Fab>
            </Box>
        </Modal>
    );
};

export default memo(Details);
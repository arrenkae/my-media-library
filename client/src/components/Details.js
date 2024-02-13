import { useEffect, useState, useContext, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { saveMedia } from "../features/media/mediaSlice";
import { useGetMedia } from "../features/media/mediaHooks";
import { Modal, Box, Typography, Fab, InputLabel, MenuItem, FormControl, Select, Rating, Slider, Stack, Input, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { LibraryContext } from "./Library";
import axios from "axios";
import { types } from "./Library";
import _ from 'lodash';
import parse from 'html-react-parser';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 6,
    borderRadius: 2
};

const Details = (props) => {
    const { library, detailsFetchId, openDetails, handleCloseDetails, setSearchResults, setOpenNotification } = useContext(LibraryContext);
    const type = useSelector(state => state.media.type);
    const [media, setMedia] = useState();
    const [status, setStatus] = useState('Backlog');
    const [progress, setProgress] = useState(0);
    const [rating, setRating] = useState(0);
    const [error, setError] = useState();
    const loadStatus = useSelector(state => state.media.load);
    
    const dispatch = useDispatch();
    const getMedia = useGetMedia();

    useEffect(()=>{
        fetchMedia()
        .then(data => {
            const existingMedia = library.find(element => element.api_id == data.api_id && element.type == type);
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
            const response = await axios.get(types[type].mediaLink + detailsFetchId + '?' + types[type].api_key);
            if (response.status === 200) {
              return {
                api_id: response.data.id,
                title: _.get(response.data, types[type].title),
                type: type,
                image: types[type].imageLink + _.get(response.data, types[type].image),
                description: _.get(response.data, types[type].description),
                released: new Date(_.get(response.data, types[type].release_date)).getTime() < new Date().getTime(),
                progress_max: _.get(response.data, types[type].progress_max),
                release_date: _.get(response.data, types[type].release_date),
                update_date: type == 'tv' ? response.data.last_air_date : null
              };
            };
        } catch (error) {
            setError('Unable to fetch media details');
        }
    };

    const save = () => {
        dispatch(saveMedia({...media,
            status,
            progress,
            rating
        }))
        .then(() => getMedia())
        .then(() => {
            if (loadStatus == 'failed') {
                setError('Unable to save')
            } else {
                handleCloseDetails();
                setSearchResults([]);
                setOpenNotification(true);
            }
        })
    }

    const handleSelect = (e) => {
        setStatus(e.target.value);
        if (e.target.value === 'Completed') {
            setProgress(media.progress_max);
        } else {
            setProgress(media.progress ? media.progress : 0);
        }
    };

    const handleSliderChange = (e) => {
        setProgress(e.target.value);
    }

    const releasedDetails = 
        <>
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
                    Progress: {progress} / {media?.progress_max}
            </Typography>
            <Slider
                value={progress}
                onChange={handleSliderChange}
                max={media?.progress_max}
                valueLabelDisplay="auto"
                aria-labelledby="input-slider"
            />
        </>

    if (media) {
        return  (
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
                    { media.released ? media.release_date ? 'Release date: ' + media.release_date : 'Release date: unknown' : 'Not yet released' }
                </Typography>
                <Typography id="latest-release-date" variant="h6" gutterBottom>
                    { media.update_date ? 'Last aired: ' + media.update_date : null }
                </Typography>
                <Typography sx={{ maxHeight: '50vh', overflowY: "scroll"}} id="modal-description" variant="body2" gutterBottom>
                    {parse(`<p>${media.description}</p>`)}
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
                        { media.released ? <MenuItem value='Active'>Active</MenuItem> : null }
                        { media.released ? <MenuItem value='On-hold'>On-hold</MenuItem> : null }
                        { media.released ? <MenuItem value='Dropped'>Dropped</MenuItem> : null }
                        { media.released ? <MenuItem value='Completed'>Completed</MenuItem> : null }
                    </Select>
                </FormControl>
                { media.released ? releasedDetails : null }
                {error ? <Alert sx={{ mt: 2, maxWidth: 400 }} severity="error">{error}</Alert> : null}
                <Fab color="primary" aria-label="save" onClick={save}>
                    <SaveIcon />
                </Fab>
            </Box>
        </Modal>
    )};
};

export default memo(Details);
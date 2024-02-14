import { useEffect, useState, useContext, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { saveMedia } from "../features/media/mediaSlice";
import { useGetMedia } from "../features/media/mediaHooks";
import { Modal, Box, Typography, Fab, InputLabel, MenuItem, FormControl, Select, Rating, Slider, Stack, Alert, CircularProgress, InputAdornment, OutlinedInput, FormHelperText, Tooltip } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { LibraryContext } from "./Library";
import axios from "axios";
import { types } from "./Library";
import _ from 'lodash';
import parse from 'html-react-parser';

const style = {
    position: { xs: 'fixed', sm: 'absolute'},
    top: { xs: '', sm: '50%'},
    left: { xs: '', sm: '50%'},
    transform: { xs: '', sm: 'translate(-50%, -50%)'},
    maxWidth: 500,
    maxHeight: '80vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 6,
    borderRadius: 2,
};

const Details = (props) => {
    const { library, detailsFetchId, openDetails, handleCloseDetails, setSearchResults, setOpenNotification } = useContext(LibraryContext);
    const fullLibrary = useSelector(state => state.media.library);
    const type = useSelector(state => state.media.type);
    const [media, setMedia] = useState();
    const [status, setStatus] = useState('Backlog');
    const [progress, setProgress] = useState(0);
    const [progress_seasons, setProgressSeasons] = useState(0);
    const [rating, setRating] = useState(0);
    const [error, setError] = useState();
    const loadStatus = useSelector(state => state.media.load);
    
    const dispatch = useDispatch();
    const getMedia = useGetMedia();

    useEffect(()=>{
        fetchMedia()
        .then(data => {
            const existingMedia = fullLibrary.find(element => element.api_id == data.api_id && element.type == data.type);
            if (existingMedia) {
                setMedia({...existingMedia, ...data});
                setStatus(existingMedia.status);
                setProgress(existingMedia.progress);
                setRating(existingMedia.rating)
                setProgressSeasons(existingMedia.progress_seasons);
            } else {
                setMedia(data);
            };
        })
        .catch(err => console.log(err))
    }, [])

    const fetchMedia = async() => {
        try {
            const response = await axios.get(types[type].mediaLink + detailsFetchId + '?' + types[type].api_key);
            if (response.status === 200) {
              return {
                api_id: response.data.id,
                title: _.get(response.data, types[type].title),
                author: type == 'book' ? response.data.volumeInfo.authors[0] : null,
                type: type,
                image: _.get(response.data, types[type].image) ? types[type].imageLink + _.get(response.data, types[type].image) : null,
                description: _.get(response.data, types[type].description),
                released: new Date(_.get(response.data, types[type].release_date)).getTime() < new Date().getTime(),
                progress_max: _.get(response.data, types[type].progress_max),
                progress_seasons_max: type == 'tv' ? response.data.number_of_seasons : null,
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
            rating,
            progress_seasons: type === 'tv' ? progress_seasons : null

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
            if ( type === 'tv') {
                setProgressSeasons(media.progress_seasons_max);
            }
        } else {
            setProgress(media.progress ? media.progress : 0);
            if ( type === 'tv') {
                setProgressSeasons(media.progress_seasons ? media.progress_seasons : 0);
            }
        }
    };

    const handleProgressChange = (e) => {
        setProgress(e.target.value === '' ? 0 : Number(e.target.value));
    }

    const handleSliderChange = (e) => {
        setProgress(e.target.value);
    }

    const handleSeasonChange = (e) => {
        setProgressSeasons(e.target.value === '' ? 0 : Number(e.target.value));
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
                    Progress: {progress} / {media?.progress_max} {types[type].progress}
            </Typography>
            <Slider
                value={progress}
                onChange={handleSliderChange}
                max={media?.progress_max}
                valueLabelDisplay="auto"
                aria-labelledby="input-slider"
                sx={{ mb: 1, display: { xs: 'none', sm: 'flex' }}}
            />
            <Stack spacing={1} direction={{ sm: 'column', md: 'row' }} flexDirection="flex-start" >
                <FormControl variant="outlined">
                    <OutlinedInput
                        id="progress-number-input"
                        value={progress}
                        onChange={handleProgressChange}
                        endAdornment={<InputAdornment position="end"> / {media?.progress_max}</InputAdornment>}
                        inputProps={{
                        min: 0,
                        max: media?.progress_max,
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                        }}
                        sx={{ maxWidth: '14ch' }}
                    />
                    <FormHelperText id="season-helper-text">{types[type].progress}</FormHelperText>
                </FormControl>
                {
                    type === 'tv' ?
                        <FormControl variant="outlined">
                            <OutlinedInput
                                id="season-number-input"
                                type="number"
                                inputProps={{ min: 0, max: media?.progress_seasons_max }}
                                value={progress_seasons}
                                endAdornment={<InputAdornment position="end"> / {media?.progress_seasons_max}</InputAdornment>}
                                onChange={handleSeasonChange}
                                sx={{ maxWidth: '12ch' }}
                            />
                            <FormHelperText id="season-helper-text">seasons</FormHelperText>
                        </FormControl>
                    : null
                }
            </Stack>
        </>

    if (media) {
        return (
            <Modal
                open={openDetails}
                onClose={handleCloseDetails}
                aria-labelledby="media-details"
                >
                <Box sx={style}>
                    <Typography id="modal-title" variant="h4" gutterBottom color="textPrimary">
                        {media.title}
                    </Typography>
                    {
                        type === 'book' ? 
                        <Typography id="book-author" variant="h5" gutterBottom color="textPrimary">
                            {media.author}
                        </Typography>
                        : null
                    }
                    <Typography id="release-date" variant="h6" color="textPrimary" gutterBottom>
                        { media.released ? media.release_date ? 'Release date: ' + media.release_date : 'Release date: unknown' : 'Not yet released' }
                    </Typography>
                    <Typography id="latest-release-date" variant="h6" color="textPrimary" gutterBottom>
                        { media.update_date ? 'Last aired: ' + media.update_date : null }
                    </Typography>
                    <Typography sx={{ maxWidth: '70vw', maxHeight: { xs: '20vh', md: '50vh'}, overflowY: "scroll"}} id="modal-description" variant="body2" color="textPrimary" gutterBottom>
                        {media.description ? parse(`<p>${media.description}</p>`) : null}
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
                    <Tooltip title="Save" placement="top">
                        <Fab color="secondary" aria-label="save" onClick={save} sx={{ position: 'absolute', bottom: 40, right: 40 }}>
                            <SaveIcon />
                        </Fab>
                    </Tooltip>
                </Box>
            </Modal>
    )} else {
        return <CircularProgress />
    };
};

export default memo(Details);
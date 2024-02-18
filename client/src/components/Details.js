import { useEffect, useState, useRef, useContext, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Modal, Box, Stack, Typography, Fab, OutlinedInput, InputLabel, InputAdornment, FormHelperText, MenuItem, FormControl, Select, Rating, Slider, Tooltip } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import axios from "axios";
import parse from 'html-react-parser';
import { LibraryContext, types, statusNames } from "./Library";
import { saveMedia, setMessage } from "../features/media/mediaSlice";
import { useGetMedia } from "../features/media/mediaHooks";
import DetailsReleased from "./DetailsReleased";

const BASE_URL = process.env.REACT_APP_BASE_URL;

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
    const { type, detailsFetchId, openDetails, handleCloseDetails, setSearchResults, showNotification } = useContext(LibraryContext);
    const fullLibrary = useSelector(state => state.media.library);
    const [media, setMedia] = useState();
    const [status, setStatus] = useState('backlog');
    const [progress, setProgress] = useState(0);
    const [progress_seasons, setProgressSeasons] = useState(0);
    const [rating, setRating] = useState(0);
    const [tempStatus, setTempStatus] = useState();
    const [tempProgress, setTempProgress] = useState();
    const [tempSeasons, setTempSeasons] = useState();
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const getMedia = useGetMedia();

    useEffect(()=>{
        dispatch(setMessage());
        fetchMedia()
    }, [])

    useEffect(()=>{
        if (media?.status) setTempStatus((media.status != 'completed') && (media.status != 'backlog') ? media.status : 'active');
        if (media?.progress) setTempProgress(media.progress);
        if (media?.progress_seasons) setTempSeasons(media.progress_seasons);
    }, [media])

    const fetchMedia = async() => {
        try {
            const response = await axios.get(`${BASE_URL}/details/${type}/${detailsFetchId}`);
            if (response.status === 200) {
                const existingMedia = fullLibrary.find(element => element.api_id == detailsFetchId && element.type == type);
                if (existingMedia) {
                    setMedia({...existingMedia, ...response.data.media});
                    setStatus(existingMedia.status);
                    setProgress(existingMedia.progress);
                    setRating(existingMedia.rating)
                    setProgressSeasons(existingMedia.progress_seasons);
                } else {
                    setMedia(response.data.media);
                };
            } else {
                showNotification(response.data.msg, 'error');
            }
        } catch (error) {
            showNotification('Unable to get media data', 'error');
        }
    };

    const save = () => {
        dispatch(saveMedia({...media,
            status,
            progress,
            rating,
            progress_seasons: type === 'tv' ? progress_seasons : null

        }))
        .then(() => {
            handleCloseDetails();
            navigate(`/library/${type}`);
        })
        .then(() => getMedia())
    }

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        if (e.target.value === 'completed') {
            setProgress(media?.progress_max);
            if ( media?.progress_seasons_max) {
                setProgressSeasons(media?.progress_seasons_max);
            }
        } else if (e.target.value === 'backlog') {
            setProgress(0);
            if ( type === 'tv') {
                setProgressSeasons(0);
            }
        } else {
            setProgress(tempProgress);
            if ( type === 'tv' ) {
                setProgressSeasons(media?.progress_seasons || tempSeasons);
            }
            setTempStatus(status);
        }
    };

    const handleProgressChange = (e) => {
        setProgress(e.target.value === '' ? 0 : Number(e.target.value));
        if (e.target.value == media?.progress_max) {
            if ( media?.progress_seasons_max ) {
                setProgressSeasons(media?.progress_seasons_max);
            }
            setStatus('completed');
        } else if (e.target.value == 0) {
            if ( media?.progress_seasons_max ) {
                setProgressSeasons(0);
            }
            setStatus('backlog');
        } else {
            console.log(tempStatus);
            setStatus(tempStatus);
            setTempProgress(progress);
        }
    }

    const handleSeasonChange = (e) => {
        setProgressSeasons(e.target.value === '' ? 0 : Number(e.target.value));
        if (e.target.value == media?.progress_seasons_max) {
            setProgress(media?.progress_max);
            setStatus('completed');
        } else {
            setStatus(tempStatus);
            setTempSeasons(progress_seasons);
        }
    }

    const DetailsReleased =
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
                    Progress: {Math.round(progress / media?.progress_max * 100)}%
            </Typography>
            {/* Slider and the number input form display the same value and if one changes the other changes as well */}
            <Slider
                value={progress}
                onChange={handleProgressChange}
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
                    <FormHelperText id="season-helper-text">{types[type]?.progress}</FormHelperText>
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
    
    return (
        media ? 
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
                {/* Shows the release date as 'planned release date' if it's in the future */}
                {
                    (!media.released && media.release_date) ?
                    <Typography id="planned-release-date" variant="h6" color="textPrimary" gutterBottom>
                        Planned release date: {media.release_date}
                    </Typography>
                    : null
                }
                <Typography id="latest-release-date" variant="h6" color="textPrimary" gutterBottom>
                    { media.update_date ? 'Last aired: ' + media.update_date : null }
                </Typography>
                <Typography sx={{ maxWidth: '70vw', maxHeight: { xs: '20vh', md: '40vh'}, overflowY: "scroll"}} id="modal-description" variant="body2" color="textPrimary" gutterBottom>
                    {/* Uses html parser since descriptions from google books contain html tags */}
                    {media.description ? parse(`<p>${media.description}</p>`) : null}
                </Typography>
                <FormControl sx={{ m: 1, mt: 2, minWidth: 120 }} size="small">
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                        labelId="status-select-label"
                        id="status-select"
                        value={status}
                        label="Status"
                        onChange={handleStatusChange}
                        >
                        { media.released ? 
                            /* Returns status display names changing them according to type (active => watching/reading) */
                            Object.keys(statusNames).map(status => <MenuItem key={status} value={status}>{statusNames[status].replace('verb', types[type].verb)}</MenuItem>)
                            : <MenuItem value='backlog'>{statusNames.backlog.replace('verb', types[type].verb)}</MenuItem>
                        }
                    </Select>
                </FormControl>
                {/* Progress and rating are only available for the released titles */}
                { media.released ? DetailsReleased : null }
                <Tooltip title="Save" placement="top">
                    <Fab color="secondary" aria-label="save" onClick={save} sx={{ position: 'absolute', bottom: 40, right: 40 }}>
                        <SaveIcon />
                    </Fab>
                </Tooltip>
            </Box>
        </Modal>
        : null
    )
};

export default memo(Details);
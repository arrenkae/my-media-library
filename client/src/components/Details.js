import { useEffect, useState, useRef, useContext, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Box, Typography, Fab, InputLabel, MenuItem, FormControl, Select, CircularProgress, Tooltip } from '@mui/material';
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
    const { detailsFetchId, openDetails, handleCloseDetails, setSearchResults, showNotification } = useContext(LibraryContext);
    const fullLibrary = useSelector(state => state.media.library);
    const type = useSelector(state => state.media.type);
    const [media, setMedia] = useState();
    const [status, setStatus] = useState('backlog');
    const [progress, setProgress] = useState(0);
    const [progress_seasons, setProgressSeasons] = useState(0);
    const [rating, setRating] = useState(0);
    const prevProgressRef = useRef();
    
    const dispatch = useDispatch();
    const getMedia = useGetMedia();

    useEffect(()=>{
        dispatch(setMessage());
        fetchMedia();
    }, [])

    /* Ref used to store previous progress value so that it doesn't get reset after switching back from completed and backlog statuses */
    useEffect(() => {
        /* For existing media, resets to the value from the database insead of the last input */
        if (media?.progress) {
            prevProgressRef.current = media.progress;
        } else if (( progress != 0 ) && ( progress != media?.progress_max )) {
            prevProgressRef.current = progress;
        }
    }, [progress])

    const fetchMedia = async() => {
        console.log(`${BASE_URL}/search/${type}/details/${detailsFetchId}`);
        try {
            const response = await axios.get(`${BASE_URL}/search/${type}/details/${detailsFetchId}`);
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
            setSearchResults([]);
        })
        .then(() => getMedia())
    }

    const handleSelect = (e) => {
        setStatus(e.target.value);
        /* Progress is automatically set to max when selecting 'completed' and to 0 when selecting 'plan to watch/read' */
        if (e.target.value === 'completed') {
            setProgress(media.progress_max);
            if ( type === 'tv') {
                setProgressSeasons(media.progress_seasons_max);
            }
        } else if (e.target.value === 'backlog') {
            setProgress(0);
            if ( type === 'tv') {
                setProgressSeasons(0);
            }
        } else {
            setProgress(prevProgressRef.current);
            if ( type === 'tv') {
                setProgressSeasons(media.progress_seasons ? media.progress_seasons : 0);
            }
        }
    };
    
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
                        onChange={handleSelect}
                        >
                        { media.released ? 
                            /* Returns status display names changing them according to type (active => watching/reading) */
                            Object.keys(statusNames).map(status => <MenuItem value={status}>{statusNames[status].replace('verb', types[type].verb)}</MenuItem>)
                            : <MenuItem value='backlog'>{statusNames.backlog.replace('verb', types[type].verb)}</MenuItem>
                        }
                    </Select>
                </FormControl>
                {/* Progress and rating are only available for the released titles */}
                { media.released ?
                <DetailsReleased
                    media={media}
                    progress={progress}
                    setProgress={setProgress}
                    progress_seasons={progress_seasons}
                    setProgressSeasons={setProgressSeasons}
                    rating={rating}
                    setRating={setRating}
                    setStatus={setStatus}
                /> : null }
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
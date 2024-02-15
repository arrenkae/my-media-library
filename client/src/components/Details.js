import { useEffect, useState, useContext, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Box, Typography, Fab, InputLabel, MenuItem, FormControl, Select, Alert, CircularProgress, Tooltip } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import axios from "axios";
import parse from 'html-react-parser';
import _ from 'lodash';
import { LibraryContext, types, statusNames } from "./Library";
import { saveMedia } from "../features/media/mediaSlice";
import { useGetMedia } from "../features/media/mediaHooks";
import DetailsReleased from "./DetailsReleased";

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
    const { detailsFetchId, openDetails, handleCloseDetails, setSearchResults, setOpenNotification } = useContext(LibraryContext);
    const fullLibrary = useSelector(state => state.media.library);
    const type = useSelector(state => state.media.type);
    const [media, setMedia] = useState();
    const [status, setStatus] = useState('backlog');
    const [progress, setProgress] = useState(0);
    const [progress_seasons, setProgressSeasons] = useState(0);
    const [rating, setRating] = useState(0);
    const [error, setError] = useState();
    const loadStatus = useSelector(state => state.media.load);
    
    const dispatch = useDispatch();
    const getMedia = useGetMedia();

    /* Even if the media is already in the library, fetches and updates the details in case it was updated in the original database */
    useEffect(()=>{
        fetchMedia()
        .then(data => {
            /* Searches for existig media in the entire library instead of the possbly filtered version from LibraryContext */
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
        /* Need to figure out where to display this error */
        .catch(err => console.log(err))
    }, [])

    const fetchMedia = async() => {
        try {
            /* Constructs an API link depending on the media type using the template object */
            const response = await axios.get(types[type].mediaLink + detailsFetchId + '?' + types[type].api_key);
            if (response.status === 200) {
              return {
                /* _get is used so that an object can access nested keys from a string variable */
                api_id: response.data.id,
                title: _.get(response.data, types[type].title),
                author: type == 'book' ? response.data.volumeInfo.authors[0] : null,
                type: type,
                image: _.get(response.data, types[type].image) ? types[type].imageLink + _.get(response.data, types[type].image) : null,
                description: _.get(response.data, types[type].description),
                released: _.get(response.data, types[type].release_date) ? 
                    new Date(_.get(response.data, types[type].release_date)).getTime() < new Date().getTime() : false,
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
        /* If user selects 'completed' status, automatically sets progress to maximum, and restores it to current progress (if any) if the selection changes again */
        if (e.target.value === 'completed') {
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
                /> : null }
                {error ? <Alert sx={{ mt: 2, maxWidth: 400 }} severity="error">{error}</Alert> : null}
                <Tooltip title="Save" placement="top">
                    <Fab color="secondary" aria-label="save" onClick={save} sx={{ position: 'absolute', bottom: 40, right: 40 }}>
                        <SaveIcon />
                    </Fab>
                </Tooltip>
            </Box>
        </Modal>
        : <CircularProgress />
    )
};

export default memo(Details);
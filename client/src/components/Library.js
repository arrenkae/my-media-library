import { useState, useEffect, createContext, memo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Stack, Box, Tabs, Tab, Divider } from '@mui/material';
import { setMessage } from "../features/media/mediaSlice";
import { useLibrarySelect, useFilterType } from "../features/media/mediaHooks";
import LibraryData from './LibraryData';
import Details from "./Details";
import Search from './Search';
import Notification from './Notification';
import TopBar from './TopBar';

export const LibraryContext = createContext();

/* Used to change some info text depending on the current media type */
export const types = {
    tv: {
        typename: 'TV shows',
        progress: 'episodes',
        verb: 'Watch'
    },
    movies: {
        typename: 'movies',
        progress: 'minutes',
        verb: 'Watch'
    },
    books: {
        typename: 'books',
        progress: 'pages',
        verb: 'Read'
    }
  }

/* Display names for statuses, 'verb' is there to be replaced by an appropriate type verb */
export const statusNames = {
    active: 'verbing',
    backlog: 'Plan to verb',
    onhold: 'On-hold',
    completed: 'Completed',
    dropped: 'Dropped'
}

const Library = ({type, search}) => {
    /* Custom hook returns library with all the current filters applied */
    const library = useLibrarySelect();
    const message = useSelector(state => state.media.message);
    const loadStatus = useSelector(state => state.media.load);
    const defaultType = useSelector(state => state.media.type);
    const [openDetails, setOpenDetails] = useState(false);
    const [detailsFetchId, setDetailsFetchId] = useState();
    const [openNotification, setOpenNotification] = useState(false);
    const [notification, setNotification] = useState();
    const [notificationType, setNotificationType] = useState();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const selectType = useFilterType();

    /* Default type can be potentially changed so it's better to keep it as a variable */
    useEffect(()=>{
        if (!type) {
            navigate(`/library/${defaultType}`);
        }
    }, [])

    /* Filters and returns user library based on the current page and user id from the token */
    useEffect(()=>{
        selectType(type);
    }, [type])
    
    useEffect(()=>{
        if (loadStatus === 'failed' && message) {
            showNotification(message, 'error');
            dispatch(setMessage());
        } else if (loadStatus === 'succeded' && message) {
            showNotification(message, 'success');
            dispatch(setMessage());
        }
    }, [loadStatus])

    /* Functions to handle the modal component for Details, passed in the LibraryContext since it can be opened from several components */
    const handleOpenDetails = (id) => {
        setDetailsFetchId(id);
        setOpenDetails(true);
    };

    const handleCloseDetails = () => {
        setDetailsFetchId(null);
        setOpenDetails(false);
    };

    const handleChangeType = (event, newValue) => {
        navigate(`/library/${newValue}`);
    }

    /* Function to display notification is stored in the LibraryContext to pass it to different components that might need to open it */
    const showNotification = (text, type) => {
        setNotification(text);
        setNotificationType(type);
        setOpenNotification(true);
    }

    return (
        <>
        <TopBar />
        <LibraryContext.Provider value={{
            type,
            search,
            library,
            openDetails,
            setOpenDetails,
            detailsFetchId,
            setDetailsFetchId,
            handleOpenDetails,
            handleCloseDetails,
            openNotification,
            setOpenNotification,
            showNotification
            }}>
            {/* Tab menu to select the media type */}
            <Box sx={{ width: '100%' }}>
                <Tabs value={type} onChange={handleChangeType} aria-label="type-select" role="navigation">
                    <Tab label="TV" value="tv" />
                    <Tab label="Movies" value="movies" />
                    <Tab label="Books" value="books" />
                </Tabs>
            </Box>
            <Stack>
                <Search />
                <Divider />
                <LibraryData />
            </Stack>
            {detailsFetchId ? <Details /> : null}
            {/* Notification snackbar is displayed only when its open state is toggled by a component */}
            <Notification message={notification} severity={notificationType} />
        </LibraryContext.Provider>
        </>
    )
};

export default memo(Library);
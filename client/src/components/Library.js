import { useState, useEffect, createContext, memo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from 'react-router-dom';
import { Stack, Box, Tabs, Tab, Divider } from '@mui/material';
import PropTypes from 'prop-types';
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
    const [openDetails, setOpenDetails] = useState(false);
    const [detailsFetchId, setDetailsFetchId] = useState();
    const [openNotification, setOpenNotification] = useState(false);
    const [notification, setNotification] = useState();
    const [notificationType, setNotificationType] = useState();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const selectType = useFilterType();

    useEffect(()=>{
        console.log(type);
    }, [])

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

    /* Media type is stored in the redux store, used to filter the displayed library and get pamareters for the API search */
    const handleChangeType = (event, newValue) => {
        navigate(`/library/${newValue}`);
    }

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
            {/* Tabs to select the media type */}
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

export default Library;
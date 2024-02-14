import { useState, useRef, useEffect, createContext, useContext, memo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Stack, Typography, Tabs, Tab, Box, Divider } from '@mui/material';
import LibraryData from './LibraryData';
import Details from "./Details";
import Search from './Search';
import Logout from './Logout';
import Notification from './Notification';
import TopBar from './TopBar';
import { useLibrarySelect, useFilterType } from "../features/media/mediaHooks";

export const LibraryContext = createContext();

export const types = {
    tv: {
        typename: 'TV shows',
        api_key: `api_key=${process.env.REACT_APP_API_KEY_TMDB}`,
        searchLink: 'https://api.themoviedb.org/3/search/tv?query=',
        mediaLink: 'https://api.themoviedb.org/3/tv/',
        searchResults: 'results',
        imageLink: 'https://image.tmdb.org/t/p/w200',
        image: 'poster_path',
        title: 'name',
        description: 'overview',
        release_date: 'first_air_date',
        progress_max: 'number_of_episodes',
        progress: 'episodes',
        verb: 'watch'
    },
    movie: {
        typename: 'movies',
        api_key: `api_key=${process.env.REACT_APP_API_KEY_TMDB}`,
        searchLink: 'https://api.themoviedb.org/3/search/movie?query=',
        mediaLink: 'https://api.themoviedb.org/3/movie/',
        searchResults: 'results',
        imageLink: 'https://image.tmdb.org/t/p/w200',
        image: 'poster_path',
        title: 'title',
        description: 'overview',
        release_date: 'release_date',
        progress_max: 'runtime',
        progress: 'minutes',
        verb: 'watch'
    },
    book: {
        typename: 'books',
        api_key: `key=${process.env.REACT_APP_API_KEY_BOOKS}`,
        searchLink: 'https://www.googleapis.com/books/v1/volumes?q=',
        mediaLink: 'https://www.googleapis.com/books/v1/volumes/',
        searchResults: 'items',
        imageLink: ``,
        image: 'volumeInfo.imageLinks.thumbnail',
        title: 'volumeInfo.title',
        description: 'volumeInfo.description',
        release_date: 'volumeInfo.publishedDate',
        progress_max: 'volumeInfo.pageCount',
        progress: 'pages',
        verb: 'read'
    }
  }

const Library = (props) => {
    const library = useLibrarySelect();
    const user = useSelector(state => state.users.user);
    const type = useSelector(state => state.media.type);
    const [searchResults, setSearchResults] = useState([]);
    const [openDetails, setOpenDetails] = useState(false);
    const [detailsFetchId, setDetailsFetchId] = useState(null);
    const [openNotification, setOpenNotification] = useState(false);

    const selectType = useFilterType();

    const handleOpenDetails = (id) => {
        setDetailsFetchId(id);
        setOpenDetails(true);
    };

    const handleCloseDetails = () => {
        setDetailsFetchId(null);
        setOpenDetails(false);
    };

    const handleChangeType = (event, newValue) => {
        selectType(newValue);
        setSearchResults([]);
    }

    return (
        <>
        <TopBar />
        <LibraryContext.Provider value={{
            library,
            searchResults,
            setSearchResults,
            openDetails,
            setOpenDetails,
            detailsFetchId,
            setDetailsFetchId,
            handleOpenDetails,
            handleCloseDetails,
            openNotification,
            setOpenNotification
            }}>
            <Stack sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={type} onChange={handleChangeType} aria-label="type-select">
                    <Tab label="TV" value="tv" />
                    <Tab label="Movies" value="movie" />
                    <Tab label="Books" value="book" />
                </Tabs>
            </Stack>
            <Stack>
                <Search />
                <Divider />
                <LibraryData />
            </Stack>
            {detailsFetchId ? <Details /> : null}
            <Notification message={'Library updated!'} />
        </LibraryContext.Provider>
        </>
    )
};

export default memo(Library);
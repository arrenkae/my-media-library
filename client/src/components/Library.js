import { useState, useEffect, createContext } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { userMedia } from "../features/media/mediaSlice";
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LibraryData from './LibraryData';
import Details from "./Details";
import Search from './Search';
import Logout from './Logout';

export const LibraryContext = createContext();

const Library = (props) => {
    const token = useSelector(state => state.users.token);
    const [openDetails, setOpenDetails] = useState(false);
    const [detailsFetchId, setDetailsFetchId] = useState(null);

    console.log(token);

    const handleOpenDetails = (id) => {
        setDetailsFetchId(id);
        setOpenDetails(true);
    };
    const handleCloseDetails = () => {
        setDetailsFetchId(null);
        setOpenDetails(false);
    };

    return (
        <>
        <Logout />
        <LibraryContext.Provider value={{openDetails, setOpenDetails, detailsFetchId, setDetailsFetchId, handleOpenDetails, handleCloseDetails}}>
            <Search />
            <LibraryData />
            {detailsFetchId ? <Details /> : null}
        </LibraryContext.Provider>
        </>
    )
};

export default Library;
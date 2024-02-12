import { useState, useEffect, createContext, useContext } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { userMedia } from "../features/media/mediaSlice";
import { Stack, Typography } from '@mui/material';

import LibraryData from './LibraryData';
import Details from "./Details";
import Search from './Search';
import Logout from './Logout';
import { AuthContext } from "../App";

export const LibraryContext = createContext();

const Library = (props) => {
    const [openDetails, setOpenDetails] = useState(false);
    const [detailsFetchId, setDetailsFetchId] = useState(null);
    const {user} = useContext(AuthContext);

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
        <Stack direction="row" spacing={2} sx={{m:5}}>
            <Typography id="user-welcome" variant="h4">
                Welcome, {user?.username}
            </Typography>
            <Logout />
        </Stack>
        <LibraryContext.Provider value={{openDetails, setOpenDetails, detailsFetchId, setDetailsFetchId, handleOpenDetails, handleCloseDetails}}>
            <Search />
            <LibraryData />
            {detailsFetchId ? <Details /> : null}
        </LibraryContext.Provider>
        </>
    )
};

export default Library;
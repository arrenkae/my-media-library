import { useState, useEffect, memo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { userMedia } from "../features/media/mediaSlice";
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import LibraryCard from './LibraryCard';

const LibraryData = (props) => {
    const library = useSelector(state => state.media.library);
    const loadStatus = useSelector(state => state.media.load);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(userMedia());
    }, []);

    const renderLibrary = 
        <>
            <h1>Your Library</h1>
            <Box sx={{ flexGrow: 1, m: 5 }}>
                <Grid container spacing={3}>
                    {library.map(element =>
                        <Grid item key={element.id}>
                            <LibraryCard media={element} />
                        </Grid>
                    )}
                </Grid>
            </Box>
        </>

    if (loadStatus === 'loading') {
        return <CircularProgress />;
    } else if (loadStatus === 'failed') {
        return <h2>Unable to load library</h2>;
    } else if (loadStatus === 'succeded') {
        if (library.length > 0) {
            return renderLibrary;
        } else {
            return ;
        }
    } else {
        return null;
    }
};

export default memo(LibraryData);
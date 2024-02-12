import { useState, useRef, useEffect, useContext, memo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { userMedia } from "../features/media/mediaSlice";
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import LibraryCard from './LibraryCard';
import { LibraryContext } from "./Library";

const LibraryData = (props) => {
    const { library } = useContext(LibraryContext);
    const loadStatus = useSelector(state => state.media.load);
    const dispatch = useDispatch();
    const type = useSelector(state => state.media.type);

    useEffect(()=>{
        dispatch(userMedia());
    }, []);

    const renderLibrary = 
        <>
            <h1>Your {type} Library</h1>
            { library.length > 0 ?
            <Box sx={{ flexGrow: 1, m: 5 }}>
                <Grid container spacing={3}>
                    {library.map(element =>
                        <Grid item key={element.id}>
                            <LibraryCard media={element} />
                        </Grid>
                    )}
                </Grid>
            </Box>
            : <h2>Your {type} library is empty!</h2> }
        </>

    if (loadStatus === 'loading') {
        return <CircularProgress />;
    } else if (loadStatus === 'failed') {
        return <h2>Unable to load library</h2>;
    } else if (loadStatus === 'succeded') {
        return renderLibrary;
    } else {
        return null;
    }
};

export default memo(LibraryData);
import { useEffect, useContext, memo } from 'react';
import { useSelector } from "react-redux";
import { Grid, Box, Typography, Stack, LinearProgress } from '@mui/material';
import { useGetMedia } from "../features/media/mediaHooks";
import { LibraryContext, types } from "./Library";
import LibraryCard from './LibraryCard';
import LibraryFilters from './LibraryFilters';

const LibraryData = (props) => {
    const { type, library } = useContext(LibraryContext);
    const fullLibrary = useSelector(state => state.media.library);
    const loadStatus = useSelector(state => state.media.load);

    const getMedia = useGetMedia();

    useEffect(()=>{
        /* Refreshes the library from the database based on the logged in user id */
        getMedia();
    }, []);

    const renderLibrary = 
        <Stack spacing={2} direction="column" alignItems="flex-start" sx={{ m: 5 }}>
            <Typography id="library-header" variant="h3" color="text.primary" gutterBottom>
                My {types[type]?.typename}
            </Typography>
            <LibraryFilters />
            { library?.length > 0 ?
            <Box sx={{ flexGrow: 1, mt: 5 }}>
                <Grid container spacing={3}>
                    {library.map(element =>
                        <Grid item key={element.id} style={{display: 'flex'}} >
                            <LibraryCard key={element.id} media={element} />
                        </Grid>
                    )}
                </Grid>
            </Box>
            : 
            fullLibrary.length > 0 ?
                /* Different message depending on whether the entire library is empty or just no results after filtering */
                <Typography id="no-filter-results-header" variant="h5" color="textPrimary">
                    Nothing to see here!
                </Typography> : 
                <>
                <Typography id="empty-library-header" variant="h5" color="textPrimary">
                    Your library is empty!
                </Typography>
                <Typography id="empty-library-text" variant="paragraph" color="textSecondary">
                    Start filling it by searching for new media.
                </Typography>
                </>
            }
        </Stack>
        
    if (loadStatus === 'loading') {
        return <LinearProgress />;
    } else if (loadStatus === 'failed') {
        return <h2>Unable to load library</h2>;
    } else if (loadStatus === 'succeded') {
        return renderLibrary;
    } else {
        return null;
    }
};

export default memo(LibraryData);
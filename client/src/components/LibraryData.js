import { useState, useRef, useEffect, useContext, memo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Grid, Box, Typography, CircularProgress, ToggleButton, ToggleButtonGroup, Stack, Select, InputLabel, MenuItem, FormControl, LinearProgress } from '@mui/material';
import LibraryCard from './LibraryCard';
import { useGetMedia, useFilterStatus, useSelectSort } from "../features/media/mediaHooks";
import { LibraryContext } from "./Library";
import { types } from './Library';

const LibraryData = (props) => {
    const { library } = useContext(LibraryContext);
    const loadStatus = useSelector(state => state.media.load);
    const dispatch = useDispatch();
    const type = useSelector(state => state.media.type);
    const status = useSelector(state => state.media.status);
    const sort = useSelector(state => state.media.sort);

    const getMedia = useGetMedia();
    const filterStatus = useFilterStatus();
    const selectSort = useSelectSort();

    useEffect(()=>{
        getMedia();
    }, []);

    const handleStatusChange = (e, newStatus) => {
        filterStatus(newStatus);
    }

    const handleSort = (e) => {
        selectSort(e.target.value);
    }

    const renderLibrary = 
        <Stack spacing={2} direction="column" alignItems="flex-start" sx={{ m: 5 }}>
            <Typography id="library-header" variant="h4" gutterBottom>
                Your {types[type].typename}
            </Typography>
            <Stack direction="row" spacing={2}>
                <ToggleButtonGroup
                    color="primary"
                    value={status}
                    exclusive
                    onChange={handleStatusChange}
                    aria-label="status-filter"
                    gutterBottom
                    >
                    <ToggleButton value="All">All</ToggleButton>
                    <ToggleButton value="Active">Active</ToggleButton>
                    <ToggleButton value="Backlog">Backlog</ToggleButton>
                    <ToggleButton value="On-hold">On-hold</ToggleButton>
                    <ToggleButton value="Completed">Completed</ToggleButton>
                    <ToggleButton value="Dropped">Dropped</ToggleButton>
                </ToggleButtonGroup>
                <FormControl sx={{ m: 1, minWidth: 120 }} >
                    <InputLabel id="sorting-select-label">Sort by</InputLabel>
                    <Select
                        labelId="sorting-select-label"
                        id="sorting-select"
                        value={sort}
                        label="Sort by"
                        onChange={handleSort}
                        >
                        <MenuItem value='updated'>Last updated</MenuItem>
                        <MenuItem value='name'>Name</MenuItem>
                        <MenuItem value='rating'>Rating</MenuItem>
                        <MenuItem value='release'>Release date</MenuItem>
                    </Select>
                </FormControl>
            </Stack>
            { library?.length > 0 ?
            <Box sx={{ flexGrow: 1, mt: 5 }}>
                <Grid container spacing={3}>
                    {library.map(element =>
                        <Grid item key={element.id}>
                            <LibraryCard media={element} />
                        </Grid>
                    )}
                </Grid>
            </Box>
            : 
            <Typography id="empty-library" variant="h5" sx={{mt: 5}}>
                Nothing to see here!
            </Typography>
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
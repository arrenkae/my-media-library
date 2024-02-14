import { useState, useRef, useEffect, useContext, memo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Grid, Box, Typography, ToggleButton, ToggleButtonGroup, Stack, Select, InputLabel, MenuItem, FormControl, LinearProgress, Switch, FormControlLabel } from '@mui/material';
import LibraryCard from './LibraryCard';
import { useGetMedia, useFilterStatus, useSelectSort, useReverseSort } from "../features/media/mediaHooks";
import { LibraryContext } from "./Library";
import { types } from './Library';

const LibraryData = (props) => {
    const { library } = useContext(LibraryContext);
    const fullLibrary = useSelector(state => state.media.library);
    const loadStatus = useSelector(state => state.media.load);

    const type = useSelector(state => state.media.type);
    const status = useSelector(state => state.media.status);
    const sort = useSelector(state => state.media.sort);
    const ascending = useSelector(state => state.media.ascending);

    const getMedia = useGetMedia();
    const filterStatus = useFilterStatus();
    const selectSort = useSelectSort();
    const reverseSort = useReverseSort();

    useEffect(()=>{
        getMedia();
    }, []);

    const handleStatusChange = (e, newStatus) => {
        filterStatus(newStatus);
    }

    const handleSort = (e) => {
        selectSort(e.target.value);
        if ((e.target.value === 'name' && ascending === false) || (e.target.value != 'name' && ascending === true)) {
            reverseSort();
        }
    }

    const renderLibrary = 
        <Stack spacing={2} direction="column" alignItems="flex-start" sx={{ m: 5 }}>
            <Typography id="library-header" variant="h3" color="text.primary" gutterBottom>
                My {types[type].typename}
            </Typography>
            <Stack direction={{ sm: 'column', md: 'row' }} spacing={2} sx={{ maxWidth: '90%' }}>
                <ToggleButtonGroup
                    color="primary"
                    value={status}
                    exclusive
                    onChange={handleStatusChange}
                    aria-label="status-filter"
                    gutterBottom
                    sx={{ 
                        border: { xs: 1, sm: '' },
                        borderColor: { xs: 'divider', sm: '' },
                        flexDirection: { xs: 'column', sm: 'row' },
                        mb: { xs: 2, sm: 0 },
                    }}
                    >
                    <ToggleButton value="All">All</ToggleButton>
                    <ToggleButton value="Active">Active</ToggleButton>
                    <ToggleButton value="Backlog">Backlog</ToggleButton>
                    <ToggleButton value="On-hold">On-hold</ToggleButton>
                    <ToggleButton value="Completed">Completed</ToggleButton>
                    <ToggleButton value="Dropped">Dropped</ToggleButton>
                </ToggleButtonGroup>
                <FormControl sx={{ m: 1, minWidth: 120 }} >
                    <InputLabel id="sorting-select-label" >Sort by</InputLabel>
                    <Select
                        labelId="sorting-select-label"
                        id="sorting-select"
                        value={sort}
                        label="Sort by"
                        onChange={handleSort}
                        >
                        <MenuItem value='updated'>Updated</MenuItem>
                        <MenuItem value='name'>Name</MenuItem>
                        <MenuItem value='rating'>Rating</MenuItem>
                        <MenuItem value='release'>Released</MenuItem>
                    </Select>
                </FormControl>
                <FormControlLabel control={
                    <Switch
                    checked={ascending}
                    onChange={reverseSort}
                    inputProps={{ 'aria-label': 'reverse-sorting' }}
                    />
                }label={ ascending ? 'Ascending' : 'Descending'} />
            </Stack>
            { library?.length > 0 ?
            <Box sx={{ flexGrow: 1, mt: 5 }}>
                <Grid container spacing={3}>
                    {library.map(element =>
                        <Grid item key={element.id} style={{display: 'flex'}} >
                            <LibraryCard media={element} />
                        </Grid>
                    )}
                </Grid>
            </Box>
            : 
            fullLibrary.length > 0 ?
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
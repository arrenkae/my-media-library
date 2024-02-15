import { useState, useRef, useEffect, useContext, memo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Grid, Box, Typography, ToggleButton, ToggleButtonGroup, Stack, Select, InputLabel, MenuItem, FormControl, LinearProgress, Switch, FormControlLabel, Paper, InputBase, Tooltip, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import LibraryCard from './LibraryCard';
import { useGetMedia, useFilterStatus, useSelectSort, useReverseSort, useSearchLibrary } from "../features/media/mediaHooks";
import { LibraryContext } from "./Library";
import { types } from './Library';
import { statusNames } from './Library';

const LibraryData = (props) => {
    const { library } = useContext(LibraryContext);
    const fullLibrary = useSelector(state => state.media.library);
    const loadStatus = useSelector(state => state.media.load);
    const search = useSelector(state => state.media.search);

    const type = useSelector(state => state.media.type);
    const status = useSelector(state => state.media.status);
    const sort = useSelector(state => state.media.sort);
    const ascending = useSelector(state => state.media.ascending);

    const getMedia = useGetMedia();
    const filterStatus = useFilterStatus();
    const searchLibrary = useSearchLibrary();
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

    const handleSearch = (e) => {
        searchLibrary(e.target.value);
    }

    const handleClear = () => {
        searchLibrary('');
    }

    const renderLibrary = 
        <Stack spacing={2} direction="column" alignItems="flex-start" sx={{ m: 5 }}>
            <Typography id="library-header" variant="h3" color="text.primary" gutterBottom>
                My {types[type].typename}
            </Typography>
            <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', maxWidth: { xs: '90%', sm: 400 }, }}
                >
                <SearchIcon sx={{ ml: 1 }} />
                <InputBase
                sx={{ ml: 1, flex: 1 }}
                inputProps={{ 'aria-label': 'search new media' }}
                value={search}
                onChange={handleSearch}
                />
                <Tooltip title="Clear" placement="top">
                    <IconButton aria-label="clear-button" color='primary' size="small" onClick={handleClear}>
                        <ClearIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Paper>
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
                    <ToggleButton value="all">All</ToggleButton>
                    {
                        Object.keys(statusNames).map(status => <ToggleButton value={status}>{statusNames[status].replace('verb', types[type].verb)}</ToggleButton>)
                    }
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
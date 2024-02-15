import { memo } from 'react';
import { useSelector } from "react-redux";
import { ToggleButton, ToggleButtonGroup, Stack, Select, InputLabel, MenuItem, FormControl, Switch, FormControlLabel, Paper, InputBase, Tooltip, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useFilterStatus, useSelectSort, useReverseSort, useSearchLibrary } from "../features/media/mediaHooks";
import { types, statusNames } from './Library';

const LibraryFilters = (props) => {
    const type = useSelector(state => state.media.type);
    const status = useSelector(state => state.media.status);
    const search = useSelector(state => state.media.search);
    const sort = useSelector(state => state.media.sort);
    const ascending = useSelector(state => state.media.ascending);

    const filterStatus = useFilterStatus();
    const searchLibrary = useSearchLibrary();
    const selectSort = useSelectSort();
    const reverseSort = useReverseSort();

    const handleStatusChange = (e, newStatus) => {
        filterStatus(newStatus);
    }

    const handleSearch = (e) => {
        searchLibrary(e.target.value);
    }

    /* Default ascending/descending toggle positions are different depending on the sorting type */
    const handleSort = (e) => {
        selectSort(e.target.value);
        if ((e.target.value === 'name' && ascending === false) || (e.target.value != 'name' && ascending === true)) {
            reverseSort();
        }
    }

    /* When search is empty returns the entire library without search filtering */
    const handleClear = () => {
        searchLibrary('');
    }

    return (
        <>
            {/* Search field */}
            <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', maxWidth: { xs: '90%', sm: 400 }, }}
                >
                <SearchIcon fontSize="small" sx={{ ml: 1 }} />
                <InputBase
                sx={{ ml: 1, flex: 1 }}
                inputProps={{ 'aria-label': 'search the library' }}
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
                {/* Toggle buttons to filter by status */}
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
                        /* Returns status display names changing them according to type (active => watching/reading) */
                        Object.keys(statusNames).map(status => <ToggleButton value={status}>{statusNames[status].replace('verb', types[type].verb)}</ToggleButton>)
                    }
                </ToggleButtonGroup>
                {/* Selector for sorting type */}
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
                {/* Toggle between ascending and descending sort */}
                <FormControlLabel control={
                    <Switch
                    checked={ascending}
                    onChange={reverseSort}
                    inputProps={{ 'aria-label': 'reverse-sorting' }}
                    />
                }label={ ascending ? 'Ascending' : 'Descending'} />
            </Stack>
        </>
    )
};

export default memo(LibraryFilters);
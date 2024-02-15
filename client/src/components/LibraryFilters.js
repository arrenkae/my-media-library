import { memo } from 'react';
import { useSelector } from "react-redux";
import { ToggleButton, ToggleButtonGroup, Stack, Select, InputLabel, MenuItem, FormControl, Switch, FormControlLabel, Paper, InputBase, Tooltip, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useFilterStatus, useSelectSort, useReverseSort, useSearchLibrary } from "../features/media/mediaHooks";
import { types } from './Library';
import { statusNames } from './Library';

const LibraryFilters = (props) => {
    const search = useSelector(state => state.media.search);
    const type = useSelector(state => state.media.type);
    const status = useSelector(state => state.media.status);
    const sort = useSelector(state => state.media.sort);
    const ascending = useSelector(state => state.media.ascending);

    const filterStatus = useFilterStatus();
    const searchLibrary = useSearchLibrary();
    const selectSort = useSelectSort();
    const reverseSort = useReverseSort();

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

    return (
        <>
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
        </>
    )
};

export default memo(LibraryFilters);
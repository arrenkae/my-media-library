import { useState, useEffect, useContext, memo } from "react";
import { useSelector } from "react-redux";
import { Grid, Box, Typography, CircularProgress, Stack } from '@mui/material';
import SearchCard from "./SearchCard";
import { LibraryContext } from "./Library";

const SearchData = (props) => {
    const { searchResults } = useContext(LibraryContext);

    const renderSearch = 
        <Stack spacing={2} direction="column" sx={{ alignItems: { xs: 'flex-start', md: 'center' }}} >
            <Typography id="search-results-header" color="textPrimary" sx={{typography: { xs: 'h5', md: 'h4' }}}>
                    Search results for: {searchResults.query}
            </Typography>
            <Box sx={{ m: 5 }}>
                <Grid container spacing={3} >
                    {searchResults.results?.map(element =>
                        <Grid item key={element.id} style={{display: 'flex'}}>
                            <SearchCard media={element} />
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Stack>

    return (
        searchResults.results?.length > 0 ? renderSearch : null
    )
}

export default memo(SearchData);
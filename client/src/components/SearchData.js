import { useState, useEffect, useContext, memo } from "react";
import { useSelector } from "react-redux";
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import SearchCard from "./SearchCard";
import { LibraryContext } from "./Library";

const SearchData = (props) => {
    const { searchResults } = useContext(LibraryContext);

    const renderSearch = 
    <>
        <Typography id="search-results-header" variant="h4">
                Search results for: {searchResults.query}
        </Typography>
        <Box sx={{ flexGrow: 1, m: 5 }}>
            <Grid container spacing={3}>
                {searchResults.results?.map(element =>
                    <Grid item key={element.id}>
                        <SearchCard media={element} />
                    </Grid>
                )}
            </Grid>
        </Box>
    </>

    return (
        searchResults.results?.length > 0 ? renderSearch : null
    )
}

export default memo(SearchData);
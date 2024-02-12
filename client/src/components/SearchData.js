import { useState, useEffect, memo } from "react";
import { useSelector } from "react-redux";
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import SearchCard from "./SearchCard";

const SearchData = ({searchResults}) => {

    const renderSearch = 
    <>
        <h1>Search results</h1>
        <Box sx={{ flexGrow: 1, m: 5 }}>
            <Grid container spacing={3}>
                {searchResults.map(element =>
                    <Grid item key={element.id}>
                        <SearchCard media={element} />
                    </Grid>
                )}
            </Grid>
        </Box>
    </>

    return (
      searchResults.length > 0 ? renderSearch : null
    )
}

export default memo(SearchData);
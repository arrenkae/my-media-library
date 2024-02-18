import { useContext, memo } from "react";
import { useSearchParams } from 'react-router-dom';
import { Grid, Box, Typography } from '@mui/material';
import SearchCard from "./SearchCard";
import { LibraryContext } from "./Library";

const SearchData = ({searchResults}) => {
    const { type, search } = useContext(LibraryContext);
    const [searchParams, setSearchParams] = useSearchParams();

    return (
        <>
            <Typography id="search-results-header" color="textPrimary" sx={{typography: { xs: 'h5', md: 'h4' }, textAlign: { xs: 'left', md: 'center' }, ml: { xs: 5, md: 0 }}}>
                Search results for: {searchParams.get('q')}
            </Typography>
            <Box sx={{ m: 5 }}>
                <Grid container spacing={3} >
                    {searchResults.map(element =>
                        <Grid item key={element.id} style={{display: 'flex'}}>
                            <SearchCard media={element} />
                        </Grid>
                    )}
                </Grid>
            </Box>
        </>
    )
}

export default memo(SearchData);
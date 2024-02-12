import { useState, useContext, memo } from "react";
import { useSelector } from "react-redux";
import { Card, Box, CardActions, CardContent, CardMedia, IconButton, Fab, Typography, Chip, Rating } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LibraryCard from "./LibraryCard";
import { LibraryContext } from "./Library";

const SearchCard = ({media}) => {
    const { handleOpenDetails } = useContext(LibraryContext);
    const library = useSelector(state => state.media.library);
    const existingMedia = library.find(element => element.api_id === media.id)
    
    const renderLibraryCard = 
        <Card sx={{ maxWidth: 200, display: 'flex', flexDirection: 'column', justifyContent:'space-between' }}>
            <CardMedia
                sx={{ width: 200, height: 300 }}
                image={'https://image.tmdb.org/t/p/w200' + media.poster_path}
                title={media.name + ' poster'}
            />
            <CardContent >
                <Typography id="card-title" variant="h6" gutterBottom>
                    {media.name}
                </Typography>
                <Fab size="small" color="primary" aria-label="add" onClick={() => handleOpenDetails(media.id)}>
                    <AddIcon />
                </Fab>
            </CardContent >
        </Card>

    return existingMedia ? <LibraryCard media={existingMedia} /> : renderLibraryCard
}

export default memo(SearchCard);
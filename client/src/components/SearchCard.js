import { useState, useContext, memo } from "react";
import { useSelector } from "react-redux";
import { Card, Box, CardHeader, CardContent, CardMedia, IconButton, Fab, Typography, Chip, Rating } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LibraryCard from "./LibraryCard";
import { LibraryContext } from "./Library";
import { types } from "./Library";
import _ from 'lodash';

const SearchCard = ({media}) => {
    const { library, handleOpenDetails } = useContext(LibraryContext);
    const type = useSelector(state => state.media.type);
    const existingMedia = library.find(element => element.api_id == media.id && element.type == type);
    
    const renderLibraryCard = 
        <Card sx={{ maxWidth: 200, display: 'flex', flexDirection: 'column', justifyContent:'space-between' }}>
            <CardMedia
                sx={{ width: 200, height: 300 }}
                image={types[type].imageLink + _.get(media, types[type].image)}
                title={_.get(media, types[type].title) + ' image'}
            />
            <CardContent>
                <Typography id="card-title" variant="h6" gutterBottom>
                        {_.get(media, types[type].title)}
                </Typography>
            </CardContent >
            <CardContent sx={{ display: 'flex', justifyContent: 'flex-end' }}>    
                <Fab size="small" color="primary" aria-label="add" onClick={() => handleOpenDetails(media.id)}>
                    <AddIcon />
                </Fab>
            </CardContent >
        </Card>

    return existingMedia ? <LibraryCard media={existingMedia} /> : renderLibraryCard
}

export default memo(SearchCard);
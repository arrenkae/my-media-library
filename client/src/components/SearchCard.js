import { useState, useContext, memo } from "react";
import { useSelector } from "react-redux";
import { Card, Box, CardHeader, CardContent, CardMedia, IconButton, Fab, Typography, Chip, Rating, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LibraryCard from "./LibraryCard";
import { LibraryContext } from "./Library";
import { types } from "./Library";
import _ from 'lodash';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

const SearchCard = ({media}) => {
    const { library, handleOpenDetails } = useContext(LibraryContext);
    const type = useSelector(state => state.media.type);
    const existingMedia = library.find(element => element.api_id == media.id && element.type == type);
    
    const renderLibraryCard = 
        <Card sx={{ maxWidth: 200, display: 'flex', flexDirection: 'column', justifyContent:'space-between' }}>
            { _.get(media, types[type].image) ?
                <CardMedia
                    sx={{ width: 200, height: 300 }}
                    image={types[type].imageLink + _.get(media, types[type].image)}
                    title={_.get(media, types[type].title) + ' image'}
                /> :
                <Box sx={{ width: 200, height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ImageNotSupportedIcon fontSize="large" />
                </Box>
            }
            <CardContent>
                <Typography id="card-title" variant="h6" gutterBottom>
                        {_.get(media, types[type].title)}
                </Typography>
            </CardContent >
            <CardContent sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Tooltip title="Add" placement="top">
                    <Fab size="small" color="secondary" aria-label="add" onClick={() => handleOpenDetails(media.id)}>
                        <AddIcon />
                    </Fab>
                </ Tooltip>
            </CardContent >
        </Card>

    return existingMedia ? <LibraryCard media={existingMedia} /> : renderLibraryCard
}

export default memo(SearchCard);
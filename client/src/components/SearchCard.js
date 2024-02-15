import { useContext, memo } from "react";
import { useSelector } from "react-redux";
import { Card, Box, CardContent, CardMedia, Fab, Typography, Tooltip } from '@mui/material';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import AddIcon from '@mui/icons-material/Add';
import _ from 'lodash';
import { LibraryContext, types } from "./Library";
import LibraryCard from "./LibraryCard";

const SearchCard = ({media}) => {
    const { library, handleOpenDetails } = useContext(LibraryContext);
    const type = useSelector(state => state.media.type);
    /* Checks if the media is already in the library and if so displays the library card instead; it can then be updated */
    const existingMedia = library.find(element => element.api_id == media.id && element.type == type);
    
    const renderLibraryCard = 
        <Card sx={{ maxWidth: 200, display: 'flex', flexDirection: 'column', justifyContent:'space-between' }}>
            {/* _get is used so that an object can access nested keys from a string variable */}
            { _.get(media, types[type].image) ?
                <CardMedia
                    sx={{ width: 200, height: 300 }}
                    image={types[type].imageLink + _.get(media, types[type].image)}
                    title={_.get(media, types[type].title) + ' image'}
                /> :
                /* Displays an icon for media with no images */
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
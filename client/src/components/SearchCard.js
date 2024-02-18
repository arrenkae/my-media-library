import { useContext, memo } from "react";
import { useSelector } from "react-redux";
import { Card, Box, CardContent, CardMedia, Fab, Typography, Tooltip } from '@mui/material';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import AddIcon from '@mui/icons-material/Add';
import { LibraryContext } from "./Library";
import LibraryCard from "./LibraryCard";

const SearchCard = ({media}) => {
    const { type, library, handleOpenDetails } = useContext(LibraryContext);
    /* Checks if the media is already in the library and if so displays the library card instead; it can then be updated */
    const existingMedia = library.find(element => element.api_id == media.api_id && element.type == type);

    const renderLibraryCard = 
        <Card sx={{ maxWidth: 200, display: 'flex', flexDirection: 'column', justifyContent:'space-between' }}>
            {media.image ?
                <CardMedia
                    sx={{ width: 200, height: 300 }}
                    image={media.image}
                    title={media.title + ' image'}
                /> :
                /* Displays an icon for media with no images */
                <Box sx={{ width: 200, height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ImageNotSupportedIcon fontSize="large" />
                </Box>
            }
            <CardContent>
                <Typography id="card-title" variant="h6" gutterBottom>
                        {media.title}
                </Typography>
            {   
                media.author ?
                <Typography id="card-author" variant="h6" gutterBottom sx={{ maxWidth: '92%' }}>
                    {media.author}
                </Typography>
                : null
            }
            </CardContent >
            <CardContent sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Tooltip title="Add" placement="top">
                    <Fab size="small" color="secondary" aria-label="add" onClick={() => handleOpenDetails(media.api_id)}>
                        <AddIcon />
                    </Fab>
                </ Tooltip>
            </CardContent >
        </Card>

    return existingMedia ? <LibraryCard media={existingMedia} /> : renderLibraryCard
}

export default memo(SearchCard);
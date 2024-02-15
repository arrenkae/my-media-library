import { useState, useEffect, useContext, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteMedia, saveMedia } from "../features/media/mediaSlice";
import { useGetMedia } from "../features/media/mediaHooks";
import { Card, Box, CardActions, CardContent, CardMedia, IconButton, Tooltip, Typography, Chip, Rating, Dialog, DialogActions, DialogTitle, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { LibraryContext } from "./Library";
import { types } from "./Library";
import { statusNames } from "./Library";
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

const LibraryCard = ({media}) => {
    const { handleOpenDetails, setOpenNotification } = useContext(LibraryContext);
    const [ openConfirmation, setOpenConfirmation ] = useState(false);
    const [idToDelete, setIdToDelete] = useState();
    const type = useSelector(state => state.media.type);
    const dispatch = useDispatch();

    const getMedia = useGetMedia();

    const chipColor = () => {
        switch (media.status) {
            case 'backlog':
                return 'primary';
            case 'active':
                return 'info';
            case 'completed':
                return 'success';
            case 'onhold':
                return 'warning';
            case 'dropped':
                return 'error';
            default:
                return 'primary';
        }
    }

    const handleCloseConfirmation = () => {
        setOpenConfirmation(false);
    };

    const handleAgree = () => {
        dispatch(deleteMedia(idToDelete))
        .then(() => {
            getMedia();
            setOpenNotification(true);
        })
        setOpenConfirmation(false);
    };

    const handleOpenConfirmation = (e) => {
        setIdToDelete(e.currentTarget.value);
        setOpenConfirmation(true);
    }
    
    const renderLibraryCard = 
        <Card sx={{ maxWidth: 200, display: 'flex', flexDirection: 'column', justifyContent:'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems:'center' }}>
                { media.image ?
                    <CardMedia
                        sx={{ width: 200, height: 300 }}
                        image={types[type].imageLink + media.image}
                        title={media.title + ' poster'}
                    /> :
                    <Box sx={{ width: 200, height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <ImageNotSupportedIcon fontSize="large" />
                    </Box>
                }
                <Chip label={statusNames[media.status].replace('verb', types[type].verb)} sx={{ mt: 2, mb: 2, width: '80%' }} color={chipColor()} />
                <Typography id="card-title" variant="h6" gutterBottom sx={{ maxWidth: '92%' }}>
                    {media.title}
                </Typography>
                {   
                    type === 'book' ?
                    <Typography id="book-author" variant="h6" gutterBottom sx={{ maxWidth: '92%' }}>
                        {media.author}
                    </Typography>
                    : null
                }
            </Box>
            <CardContent >
                <Typography variant="body2" color="text.secondary">
                    {media.progress} / {media.progress_max} {types[type].progress}
                </Typography>
                {
                    type === 'tv' ?
                    <Typography variant="body2" color="text.secondary">
                        {media.progress_seasons} / {media.progress_seasons_max} seasons
                    </Typography>
                    :null
                }
                { media.rating != 0 ? <Rating sx={{ mt: 1 }} name="rating-read" defaultValue={media.rating} precision={0.5} readOnly /> : null }
            </CardContent >
            <CardActions sx={{ display: 'flex', justifyContent:'flex-end' }}>
                <Tooltip title="Edit" placement="top">
                    <IconButton
                        aria-label="edit"
                        onClick={() => handleOpenDetails(media.api_id)}
                    >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete" placement="top">
                    <IconButton
                        aria-label="delete"
                        value={media.id}
                        onClick={handleOpenConfirmation}
                        >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>

    return (
        <>
            {renderLibraryCard}
            <Dialog
                open={openConfirmation}
                onClose={handleCloseConfirmation}
                aria-labelledby="delete-confirmation-title"
                aria-describedby="delete-confirmation-description"
                >
            <DialogTitle id="delete-confirmation-title"  color="textPrimary" sx={{ m: 2 }} >
                Are you sure you want to delete this media?
            </DialogTitle>
            <DialogActions>
                <Button onClick={handleCloseConfirmation}>No</Button>
                <Button onClick={handleAgree} autoFocus>
                Yes
                </Button>
            </DialogActions>
            </Dialog>
        </>
    );
}

export default memo(LibraryCard);
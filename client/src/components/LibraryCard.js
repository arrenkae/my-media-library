import { useState, useEffect, useContext, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteMedia, saveMedia } from "../features/media/mediaSlice";
import { useGetMedia } from "../features/media/mediaHooks";
import { Card, Box, CardActions, CardContent, CardMedia, CardHeader, IconButton, Typography, Chip, Rating, Dialog, DialogActions, DialogTitle, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { LibraryContext } from "./Library";
import { types } from "./Library";

const LibraryCard = ({media}) => {
    const { handleOpenDetails, setOpenNotification } = useContext(LibraryContext);
    const [ openConfirmation, setOpenConfirmation ] = useState(false);
    const [idToDelete, setIdToDelete] = useState();
    const type = useSelector(state => state.media.type);
    const dispatch = useDispatch();

    const getMedia = useGetMedia();

    const chipColor = () => {
        switch (media.status) {
            case 'Backlog':
                return 'secondary';
            case 'Active':
                return 'info';
            case 'Completed':
                return 'success';
            case 'On-hold':
                return 'warning';
            case 'Dropped':
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
            <Box>
                <CardMedia
                    sx={{ width: 200, height: 300 }}
                    image={types[type].imageLink + media.image}
                    title={media.title + ' poster'}
                />
                <Chip label={media.status} sx={{ mt: 2, width: '80%' }} color={chipColor()} />
            </Box>
            <CardContent >
                <Typography id="card-title" variant="h6" gutterBottom>
                    {media.title}
                </Typography>
                {   
                    type === 'book' ?
                    <Typography id="book-author" variant="h6" gutterBottom>
                        {media.author}
                    </Typography>
                    : null
                }
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
                <IconButton
                    aria-label="edit"
                    onClick={() => handleOpenDetails(media.api_id)}
                >
                    <EditIcon />
                </IconButton>
                <IconButton
                    aria-label="delete"
                    value={media.id}
                    onClick={handleOpenConfirmation}
                    >
                    <DeleteIcon />
                </IconButton>
            </CardActions>
        </Card>

    return (
        <>
            {renderLibraryCard}
            <Dialog
                open={openConfirmation}
                onClose={handleCloseConfirmation}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
            <DialogTitle id="alert-dialog-title">
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
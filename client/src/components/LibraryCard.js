import { useState, useEffect, useContext, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userMedia, deleteMedia, saveMedia } from "../features/media/mediaSlice";
import { Card, Box, CardActions, CardContent, CardMedia, IconButton, Typography, Chip, Rating, Dialog, DialogActions, DialogTitle, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import { LibraryContext } from "./Library";
import { types } from "./Library";

const LibraryCard = ({media}) => {
    const { handleOpenDetails, setOpenNotification } = useContext(LibraryContext);
    const [ openConfirmation, setOpenConfirmation ] = useState(false);
    const [idToDelete, setIdToDelete] = useState();
    const type = useSelector(state => state.media.type);
    const dispatch = useDispatch();

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
            dispatch(userMedia());
            setOpenNotification(true);
        })
        setOpenConfirmation(false);
    };

    const handleOpenConfirmation = (e) => {
        setIdToDelete(e.currentTarget.value);
        setOpenConfirmation(true);
    }
    
    const renderLibraryCard = 
        <Card sx={{ maxWidth: 200, minHeight: 500, display: 'flex', flexDirection: 'column', justifyContent:'space-between' }}>
            <CardMedia
                sx={{ width: 200, height: 300 }}
                image={types[type].imageLink + media.image}
                title={media.title + ' poster'}
            />
            <CardContent >
                <Typography id="card-title" variant="h6" gutterBottom>
                    {media.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {media.progress} / {media.progress_max} {types[type].progress}
                </Typography>
                { media.rating != 0 ? <Rating sx={{ mt: 1 }} name="rating-read" defaultValue={media.rating} precision={0.5} readOnly /> : null }
                <Chip label={media.status} sx={{ mt: 1 }} color={chipColor()} />
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
                    <ClearIcon />
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
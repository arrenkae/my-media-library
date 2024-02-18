import { useState, useContext, memo } from "react";
import { useDispatch } from "react-redux";
import { Card, Box, CardActions, CardContent, CardMedia, IconButton, Tooltip, Typography, Chip, Rating, Dialog, DialogActions, DialogTitle, Button, LinearProgress, linearProgressClasses, styled } from '@mui/material';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteMedia } from "../features/media/mediaSlice";
import { useGetMedia } from "../features/media/mediaHooks";
import { LibraryContext, types, statusNames } from "./Library";

const LibraryCard = ({media}) => {
    const { type, handleOpenDetails, showNotification } = useContext(LibraryContext);
    const [ openConfirmation, setOpenConfirmation ] = useState(false);
    const [ idToDelete, setIdToDelete ] = useState();
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

    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 10,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
          backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: 5,
          backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
        },
    }));
    
    /* Functions for the delete confirmation dialog */
    const handleCloseConfirmation = () => {
        setOpenConfirmation(false);
    };

    /* If user agrees to delete the media, updates the library */
    const handleAgree = () => {
        dispatch(deleteMedia(idToDelete))
        .then(() => {
            getMedia();
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
                        image={media.image}
                        title={media.title + ' image'}
                    /> :
                    /* Displays an icon for media with no images */
                    <Box sx={{ width: 200, height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <ImageNotSupportedIcon fontSize="large" />
                    </Box>
                }
                {/* Status chip is customized with different color for different statuses and different display names based on the media */}
                <Chip label={statusNames[media.status].replace('verb', types[type]?.verb)} sx={{ mt: 2, mb: 2, width: '80%' }} color={chipColor()} />
                <Typography id="card-title" variant="h6" gutterBottom sx={{ maxWidth: '92%' }}>
                    {media.title}
                </Typography>
                {   
                    media.author ?
                    <Typography id="card-author" variant="h6" gutterBottom sx={{ maxWidth: '92%' }}>
                        {media.author}
                    </Typography>
                    : null
                }
            </Box>
            <Box>
            <CardContent >
                <BorderLinearProgress variant="determinate" value={Math.round(media.progress / media?.progress_max * 100)} />
                <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                        {media.progress} / {media.progress_max} {types[type]?.progress}
                </Typography>
                <Rating sx={{ mt: 1 }} name="rating-read" defaultValue={Number(media.rating)} precision={0.5} readOnly />
            </CardContent >
            <CardActions sx={{ display: 'flex', justifyContent:'flex-end' }}>
                <Tooltip title="Edit" placement="top">
                    <IconButton
                        aria-label="edit"
                        /* Opens the edit component */
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
            </Box>
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
                <Button onClick={handleAgree} autoFocus>Yes</Button>
            </DialogActions>
            </Dialog>
        </>
    );
}

export default memo(LibraryCard);
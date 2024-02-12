import { useState, useEffect, useContext, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userMedia, deleteMedia } from "../features/media/mediaSlice";
import { Card, Box, CardActions, CardContent, CardMedia, IconButton, Typography, Chip, Rating } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import { LibraryContext } from "./Library";
import { types } from "./Library";

const LibraryCard = ({media}) => {
    const { handleOpenDetails } = useContext(LibraryContext);
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
                    Progress: {media.progress} / {media.progress_max}
                </Typography>
                <Rating sx={{ mt: 1 }} name="rating-read" defaultValue={media.rating} precision={0.5} readOnly />
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
                    onClick={() => {
                        dispatch(deleteMedia(media.id));
                        dispatch(userMedia());
                    }}
                    >
                    <ClearIcon />
                </IconButton>
            </CardActions>
        </Card>

    return (
        <>
            {renderLibraryCard}
        </>
    );
}

export default memo(LibraryCard);
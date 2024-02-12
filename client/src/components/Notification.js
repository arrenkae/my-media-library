import { useState, useContext } from "react";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { LibraryContext } from "./Library";

const Notification = ({message}) => {
    const { openNotification, setOpenNotification } = useContext(LibraryContext);

    const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setOpenNotification(false);
    };

    const action = (
    <>
        <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
        >
        <CloseIcon fontSize="small" />
        </IconButton>
    </>
    );

    return (
        <Snackbar
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
        }}
        open={openNotification}
        autoHideDuration={5000}
        onClose={handleClose}
        message={message}
        action={action}
        />
    );
}

export default Notification;
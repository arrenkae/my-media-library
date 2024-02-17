import { useContext } from "react";
import { Snackbar, Alert } from '@mui/material';
import { LibraryContext } from "./Library";

const Notification = ({message, severity}) => {
    /* Can be opened by different components, so the open state and function are passed from the LibraryContext */
    const { openNotification, setOpenNotification } = useContext(LibraryContext);

    const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setOpenNotification(false);
    };

    // const action = (
    // <>
    //     <IconButton
    //     size="small"
    //     aria-label="close"
    //     color="inherit"
    //     onClick={handleClose}
    //     >
    //     <CloseIcon fontSize="small" />
    //     </IconButton>
    // </>
    // );

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
            open={openNotification}
            autoHideDuration={5000}
            onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity={severity}
                variant="filled"
                sx={{ width: '100%' }}
                >
                {message}
            </Alert>
        </Snackbar>
    );
}

export default Notification;
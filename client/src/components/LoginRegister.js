import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Box, TextField, Button, Alert, CircularProgress, Typography } from '@mui/material';
import { login, register, resetLoad, setMessage } from "../features/users/usersSlice";

const LoginRegister = ({page}) => {
    const token = useSelector(state => state.users.token);
    const loadStatus = useSelector(state => state.users.load);
    const message = useSelector(state => state.users.message);
    const [alert, setAlert] = useState(false);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        dispatch(resetLoad());
    }, [])

    /* Reset alert and input fields when switching between login and register */
    useEffect(()=>{
        if (usernameRef.current?.value) usernameRef.current.value = '';
        if (passwordRef.current?.value) passwordRef.current.value = '';
        setAlert(false);
    }, [page])

    const loginregister = async() => {
        if (usernameRef.current.value && passwordRef.current.value) {
            /* If login is successfull, redirects to library; in other cases, notifies about the result */
            if (page === 'Login') {
                dispatch(login({username: usernameRef.current.value, password: passwordRef.current.value}))
                .then(() => showAlert());
            }
            else {
                dispatch(register({username: usernameRef.current.value, password: passwordRef.current.value}))
                .then(() => showAlert());
            }
            usernameRef.current.value = '';
            passwordRef.current.value = '';
        } else {
            dispatch(setMessage('Username and password required'));
            showAlert();
        }
    }

    const showAlert = () => {
        setAlert(true);
        setTimeout(() => { setAlert() }, 5000);
    }

    const renderLoginRegister =
        <Box sx={{m:5, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <Typography id="app-header" variant="h2" gutterBottom>
                My Media Library
            </Typography>
            <Typography id="app-description" variant="h5" color="textSecondary" sx={{display: { xs: 'none', md: 'flex' }, maxWidth: 600}} gutterBottom>
                Create and manage your personal library of TV shows, movies and books.
            </Typography>
            <Box component={'form'} sx={{m:2, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} noValidate autoComplete="off">
                <TextField
                    sx={{m:1}}
                    id='username'
                    type='username'
                    label='Username'
                    variant='outlined'
                    inputRef={usernameRef}
                />
                <TextField
                    sx={{m:1}}
                    id='password'
                    type='password'
                    label='Password'
                    variant='outlined'
                    inputRef={passwordRef}
                />
            { alert ?
                message === 'Registration successful!' ?
                <Alert severity='success'>{message}</Alert> :
                <Alert severity='error'>{message}</Alert>
                : null }
            </Box>
            <Button variant="contained" type="submit" onClick={loginregister} sx={{mb:2}} >{page}</Button>
            {
                page === 'Login' ?
                <Typography variant="h6" color="textSecondary" gutterBottom>
                    New user? <Link to='/register'>Register</Link>
                </Typography> :
                <Typography variant="h6" color="textSecondary" gutterBottom>
                    Existing user? <Link to='/login'>Log in</Link>
                </Typography>
            }
            { loadStatus == 'loading' ? <CircularProgress sx={{mt:2}}/> : null }
        </Box>

    if (loadStatus == 'succeded' && token) {
        navigate('/library');
    }

    return renderLoginRegister;

};

export default LoginRegister;
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { login, register, resetLoad, setMessage } from "../features/users/usersSlice";
import { Box, TextField, Button, Alert, CircularProgress, Typography } from '@mui/material';

const LoginRegister = ({page}) => {
    const token = useSelector(state => state.users.token);
    const [alert, setAlert] = useState(false);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const loadStatus = useSelector(state => state.users.load);
    const message = useSelector(state => state.users.message);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        dispatch(resetLoad());
    }, [])

    useEffect(()=>{
        if (usernameRef.current?.value) usernameRef.current.value = '';
        if (passwordRef.current?.value) passwordRef.current.value = '';
        setAlert(false);
    }, [page])

    const loginregister = async() => {
        if (usernameRef.current.value && passwordRef.current.value) {
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
        <Box sx={{m:5}}>
            <Typography id="app-header" variant="h2" gutterBottom>
                My Media Library
            </Typography>
            <Typography id="login-header" variant="h4" gutterBottom>
                {page}
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
                <Typography variant="h6" gutterBottom>
                    New user? <Link to='/register'>Register</Link>
                </Typography> :
                <Typography variant="h6" gutterBottom>
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
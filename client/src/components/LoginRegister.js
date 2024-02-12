import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link, redirect } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { login, register, resetLoad } from "../features/users/usersSlice";
import { Box, TextField, Button, Alert, CircularProgress } from '@mui/material';

const LoginRegister = ({page}) => {
    const token = useSelector(state => state.users.token);
    const [alert, setAlert] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const loadStatus = useSelector(state => state.users.load);
    const error = useSelector(state => state.users.error);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        dispatch(resetLoad());
    }, [])

    const loginregister = async() => {
        if (page === 'Login') {
            dispatch(login({username, password}))
        }
        else {
            dispatch(register({username, password}));
        }
    }

    const pageSwitch = () => {
        if (page === 'Login') {
            return <p>New user? <Link to='/register'>Register</Link></p>
        } else {
            return <p>Existing user? <Link to='/login'>Log in</Link></p>;
        }
    }

    const renderLoginRegister =
        <>
            <h1>{page}</h1>
            <Box component={'form'} sx={{m:2, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} noValidate autoComplete="off">
                <TextField
                    sx={{m:1}}
                    id='username'
                    type='username'
                    label='Enter your username'
                    variant='outlined'
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    sx={{m:1}}
                    id='password'
                    type='password'
                    label='Enter your password'
                    variant='outlined'
                    onChange={(e) => setPassword(e.target.value)}
                />
            {error ? <Alert severity="error">{error}</Alert> : null}
            { loadStatus == 'loading' ? <CircularProgress /> : null }
            </Box>
            <Button variant="contained" onClick={loginregister}>{page}</Button>
            <div>{pageSwitch()}</div>
        </>

    if (loadStatus == 'succeded' && token) {
        navigate('/library');
    }

    return renderLoginRegister;

};

export default LoginRegister;
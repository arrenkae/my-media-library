import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link, redirect } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { login, register, resetLoad } from "../features/users/usersSlice";
import { Box, TextField, Button } from '@mui/material';

const LoginRegister = ({page}) => {
    const token = useSelector(state => state.users.token);
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const loadStatus = useSelector(state => state.users.load);
    const errorMsg = useSelector(state => state.users.error);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        console.log(token);
        if (token) {
            console.log(token);
            return redirect('/library');
        }
        dispatch(resetLoad());
    }, [])

    const loginregister = async() => {
        if (page === 'Login') {
            dispatch(login({username, password}))
            .then(() => {
                if (loadStatus == 'succeded') {
                    navigate('/library');
                    dispatch(resetLoad());
                }
            })
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

    return (
        <div>
            <h1>{page}</h1>
            <Box component={'form'} sx={{m:1}} noValidate autoComplete="off">
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
            </Box>
            <Button variant="contained" onClick={loginregister}>{page}</Button>
            <div>{pageSwitch()}</div>
            <div className="errorMsg">{errorMsg}</div>
        </div>
    );
};

export default LoginRegister;
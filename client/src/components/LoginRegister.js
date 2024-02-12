import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link, redirect } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { login, register, resetLoad } from "../features/users/usersSlice";
import { Box, TextField, Button, Alert } from '@mui/material';
import { AuthContext } from "../App";
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const LoginRegister = ({page}) => {
    const [error, setError] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const {setToken} = useContext(AuthContext);
    const {setUser} = useContext(AuthContext);
    const navigate = useNavigate();

    const loginregister = async(e) => {
        e.preventDefault();
        if (page === 'Login') {
            try {
                const response = await axios.post(`${BASE_URL}/users/login`, {username, password},
                {
                    withCredentials: true
                });
                if(response.status = 200) {
                    setToken(response.data.token);
                    setUser(response.data.user);
                    navigate('/library');
                }
            } catch (error) {
                showError(error.response ? error.response.data.msg : error.message);
            }
        }
        else {
            try {
                const response = await axios.post(`${BASE_URL}/users/register`, {username, password},
                {
                    withCredentials: true
                });
                if(response.status = 200) {
                    navigate('/login');
                }
            } catch (error) {
                showError(error.response ? error.response.data.msg : error.message);
            }
        }
    }

    const pageSwitch = () => {
        if (page === 'Login') {
            return <p>New user? <Link to='/register'>Register</Link></p>
        } else {
            return <p>Existing user? <Link to='/login'>Log in</Link></p>;
        }
    }

    const showError = (message) => {
        setError(message);
        setTimeout(() => { setError() }, 5000);
    }

    return (
        <div>
            <h1>{page}</h1>
            <Box component={'form'} sx={{m:2, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} noValidate autoComplete="off">
                <TextField
                    sx={{m:1}}
                    id='username'
                    type='username'
                    label='Username'
                    variant='outlined'
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    sx={{m:1}}
                    id='password'
                    type='password'
                    label='Password'
                    variant='outlined'
                    onChange={(e) => setPassword(e.target.value)}
                />
            {error ? <Alert severity="error">{error}</Alert> : null}
            </Box>
            <Button variant="contained" onClick={loginregister}>{page}</Button>
            <div>{pageSwitch()}</div>
        </div>
    );
};

export default LoginRegister;
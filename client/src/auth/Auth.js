import { useEffect, useState, useContext } from "react";
import { CircularProgress } from '@mui/material';
import axios from "axios";
import { AuthContext } from '../App';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Auth = (props) => {
    const [redirect, setRedirect] = useState(false);
    const [message, setMessage] = useState('');
    const {token} = useContext(AuthContext);

    useEffect(()=>{
        verify();
    }, [])

    const verify = async() => {
        try {
            const response = await axios.get(`${BASE_URL}/users/verify`, {
                headers: {
                    'x-access-token': token ? token : ''
                },
                withCredentials: true
            })
            if (response.status === 200) {
                setRedirect(true);
                setMessage('');
            } else {
                setMessage('Not authorized');
            };
        } catch (error) {
            setRedirect(false);
            setMessage('Not authorized');
            console.log(error);
        }
    }

    return redirect ? props.children : message ? <h1>{message}</h1> : <CircularProgress />;
}

export default Auth;
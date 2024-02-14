import { Navigate } from 'react-router-dom';
import { useEffect } from "react";
import { CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import { verify } from "../features/users/usersSlice";

const Auth = (props) => {
    const token = useSelector(state => state.users.token);
    const loadStatus = useSelector(state => state.users.load);

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(verify(token));
    }, [])

    return token ? props.children : loadStatus == 'failed' ? <Navigate to="/login" /> : <CircularProgress />;
}

export default Auth;
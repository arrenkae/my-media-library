import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { verify } from "../features/users/usersSlice";

const Auth = (props) => {
    const token = useSelector(state => state.users.token);
    const loadStatus = useSelector(state => state.users.load);

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(verify(token));
    }, [])

    /* Wraps the Library component, preventing unauthorized users from accessing it and redirecting them to login */
    return token ? props.children : loadStatus == 'failed' ? <Navigate to="/login" /> : <CircularProgress />;
}

export default Auth;
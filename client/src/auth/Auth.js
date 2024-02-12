import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { verify } from "../features/users/usersSlice";

const Auth = (props) => {
    const token = useSelector(state => state.users.token);
    const loadStatus = useSelector(state => state.users.load);

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(verify(token));
    }, [])

    return loadStatus === 'succeded' ? props.children : loadStatus === 'loading' ? <h1>Loading...</h1> : <h1>Not authorized</h1>
}

export default Auth;
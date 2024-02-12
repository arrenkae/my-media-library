import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/users/usersSlice";
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';

const Logout = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout())
        .then(() => navigate('/login'));
    }

    return <Button variant="contained" onClick={handleLogout}>Logout</Button>
}

export default Logout;
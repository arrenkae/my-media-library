import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../App';
import { Button } from '@mui/material';
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Logout = (props) => {
    const navigate = useNavigate();
    const {setToken} = useContext(AuthContext);
    const {setUser} = useContext(AuthContext);

    const handleLogout = async() => {
        try {
            const response = await axios.get(`${BASE_URL}/users/logout`, {
                withCredentials: true
            })
            if (response.status === 200) {
                setToken();
                setUser();
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return <Button variant="contained" size="small" onClick={handleLogout}>Log out</Button>
}

export default Logout;
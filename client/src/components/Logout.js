import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../App';

import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Logout = (props) => {
    const navigate = useNavigate();
    const {token, setToken} = useContext(AuthContext);

    const logout = async() => {
        try {
            const response = await axios.get(`${BASE_URL}/users/logout`, {
                withCredentials: true
            })
            if (response.status === 200) {
                setToken('');
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return <button onClick={() => logout()}>Logout</button>
}

export default Logout;
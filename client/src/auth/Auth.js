import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from '../App';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Auth = (props) => {
    const [redirect, setRedirect] = useState(false);
    const {token} = useContext(AuthContext);

    useEffect(()=>{
        verify();
    }, [])

    const verify = async() => {
        try {
            const response = await axios.get(`${BASE_URL}/users/verify`, {
                headers: {
                    'x-access-token': token ? token : ''
                }
            })
            if (response.status === 200) setRedirect(true);
        } catch (error) {
            setRedirect(false);
            console.log(error.message);
        }
    }

    return redirect ? props.children : <h1>Not authorized</h1>
}

export default Auth;
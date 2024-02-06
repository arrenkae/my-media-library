import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from '../App';

const Auth = (props) => {
    const [redirect, setRedirect] = useState(false);
    const {token} = useContext(AuthContext);

    useEffect(()=>{
        verify();
    }, [])

    const verify = async() => {
        try {
            const response = await axios.get(`/users/verify`, {
                headers: {
                    'x-access-token': token ? token : ''
                }
            })
            if (response.status === 200) setRedirect(true);
        } catch (error) {
            setRedirect(false);
            console.log(error);
        }
    }

    return redirect ? props.children : ''
}

export default Auth;
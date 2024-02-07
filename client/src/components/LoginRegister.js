import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from "../App";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const LoginRegister = ({page}) => {
    const [errorMsg, setErrorMsg] = useState();
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const {setToken, setUser} = useContext(AuthContext);
    const navigate = useNavigate();

    const loginregister = async(e) => {
        e.preventDefault();
        console.log(process.env);
        if (page === 'Login') {
            try {
                const response = await axios.post(`${BASE_URL}/users/login`, {
                    username: usernameRef.current.value,
                    password: passwordRef.current.value
                });
                console.log(response);
                if(response.status = 200) {
                    setToken(response.data.token);
                    setUser(response.data.user);
                    navigate('/profile');
                }
            } catch (error) {
                console.log(error);
                showError(error.response.data.msg);
            }
        }
        else {
            try {
                const response = await axios.post(`${BASE_URL}/users/register`, {
                    username: usernameRef.current.value,
                    password: passwordRef.current.value
                });
                if(response.status = 200) {
                    navigate('/login');
                }
            } catch (error) {
                console.log(error);
                showError(error.response.data.msg);
            }
        }
    }

    const showError = (message) => {
        setErrorMsg(message);
        setTimeout(() => { setErrorMsg('') }, 3000);
    }

    const pageSwitch = () => {
        if (page === 'Login') {
            return <p>New user? <Link to='/register'>Register</Link></p>
        } else {
            return <p>Existing user? <Link to='/login'>Log in</Link></p>;
        }
    }

    return (
        <div>
            <h1>{page}</h1>
            <form onSubmit={loginregister}>
                <input type="text" ref={usernameRef} placeholder="Username" />
                <input type="password" ref={passwordRef} placeholder="Password" />
                <input type="submit" value={page} />
            </form>
            <div>{pageSwitch()}</div>
            <div className="errorMsg">{errorMsg}</div>
        </div>
    );
};

export default LoginRegister;
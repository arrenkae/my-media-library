import {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import Logout from './Logout';

const Home = (props) => {
    const [data, setData] = useState();
    const {token} = useContext(AuthContext);

    useEffect(()=>{
        getusers();
    }, [])

    const getusers = async() => {
        console.log(token);
        try {
            const response = await axios.get('http://localhost:3001/users/profile', {
                headers: {
                    'x-access-token': token ? token : ''
                }
            })
            if (response.status === 200) setData(response.data)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <h1>Profile</h1>
            <h2>{data ? data.msg : ''}</h2>
            <Logout />
        </>
    );
};

export default Home;
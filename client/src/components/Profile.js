import {useContext} from 'react';
import { AuthContext } from '../App';
import Logout from './Logout';

const Home = (props) => {
    const {user} = useContext(AuthContext);

    return (
        <>
            <h1>Profile</h1>
            <h2>Welcome, {user.username}!</h2>
            <Logout />
        </>
    );
};

export default Home;
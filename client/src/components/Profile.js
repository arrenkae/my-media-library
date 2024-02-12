import { useSelector } from "react-redux";
import Library from './Library';
import Logout from './Logout';

const Home = (props) => {
    const user = useSelector(state => state.users.user);

    return (
        <>
            <h1>Profile</h1>
            <h2>Welcome, {user?.username}!</h2>
            <Logout />
            <Library />
        </>
    );
};

export default Home;
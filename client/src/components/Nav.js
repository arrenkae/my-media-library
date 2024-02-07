import { Link } from 'react-router-dom';
import Auth from '../auth/Auth';

const Nav = (props) => {
    return (
        <>
            <Link className="App-link" to='/login'>Login</Link>
            <Link className="App-link" to='/profile'>Profile</Link>
            <Link className="App-link" to='/search'>Search</Link>
        </>
    );
};

export default Nav;
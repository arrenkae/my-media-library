import { Link } from 'react-router-dom';

const Nav = (props) => {
    return (
        <ul>
            <li><Link to='/login'>Login</Link></li>
            <li><Link to='/profile'>Profile</Link></li>
        </ul>
    );
};

export default Nav;
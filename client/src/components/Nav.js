import { Link } from 'react-router-dom';
import { Button, Stack } from '@mui/material';

const Nav = (props) => {
    return (
        <>  
            <Stack spacing={2} direction={'row'}>
                <Button component={Link} to='/login'>
                    Login
                </Button>
                <Button component={Link} to='/profile'>
                    Profile
                </Button>
                <Button component={Link} to='/search'>
                    Search
                </Button>
            </Stack>
        </>
    );
};

export default Nav;
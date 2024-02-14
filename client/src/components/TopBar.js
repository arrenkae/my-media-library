import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppBar, Stack, Toolbar, Typography, Button, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { logout } from "../features/users/usersSlice";

const TopBar = (props) => {
    const user = useSelector(state => state.users.user);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout())
        .then(() => navigate('/login'));
    }

    return (
          <AppBar position="static">
            <Toolbar variant="dense" sx={{ display: 'flex', justifyContent:'space-between' }}>
              <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontWeight: 600,
                    letterSpacing: '.3rem',
                  }}
                  >
                  My Media Library
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h6" component="div" >
                  {user.username}
                </Typography>
                <AccountCircle />
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </Stack>
            </Toolbar>
          </AppBar>
      );
}

export default TopBar;
import { useState, useRef, useEffect, createContext, useContext, memo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { AppBar, Stack, Toolbar, Typography, Button, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LibraryData from './LibraryData';
import Details from "./Details";
import Search from './Search';
import Logout from './Logout';
import Notification from './Notification';
import { useLibrarySelect, useFilterType } from "../features/media/mediaHooks";

const TopBar = (props) => {
    const user = useSelector(state => state.users.user);

    return (
          <AppBar position="static">
            <Toolbar>
              <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    textDecoration: 'none',
                  }}
                  >
                  My Media Library
              </Typography>
              <AccountCircle />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                User
              </Typography>
              <Button color="inherit">Login</Button>
            </Toolbar>
          </AppBar>
      );
}

export default TopBar;
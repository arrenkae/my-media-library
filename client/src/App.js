import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState, createContext } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { getToken } from "./features/users/usersSlice";
import LoginRegister from './components/LoginRegister';
import Logout from './components/Logout';
import Auth from './auth/Auth';
import './App.css';
import Library from './components/Library';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#e53170',
    },
    text: {
      primary: '#272343',
      secondary: '#5f6c7b'
    },
  },
  typography: {
    fontFamily: 'Lato',
    h1: {
      fontFamily: 'Rubik Doodle Shadow',
    },
    h2: {
      fontFamily: 'Rubik Doodle Shadow',
      color: '#094067'
    },
    h3: {
      fontFamily: 'Rubik',
    },
    h4: {
      fontFamily: 'Rubik',
    },
    h5: {
      fontFamily: 'Poppins',
    },
    h6: {
      fontFamily: 'Poppins',
    },
  },
});

function App() {
  const token = useSelector(state => state.users.token);
  const dispatch = useDispatch();

  useEffect(()=>{
    if (!token) dispatch(getToken())
  }, [])

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path='/' element={ <Navigate to="/login" /> } />
          <Route path='/login' element={<LoginRegister page={'Login'}/>} />
          <Route path='/register' element={<LoginRegister page={'Register'}/>} />
          <Route path='/library' element={<Auth><Library/></Auth>} />
          <Route path='/logout' element={<Logout />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;

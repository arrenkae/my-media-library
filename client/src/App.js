import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getToken } from "./features/users/usersSlice";
import LoginRegister from './components/LoginRegister';
import Library from './components/Library';
import Auth from './auth/Auth';
import './App.css';

/* Customizing MUI theme; using self-hosted fonts */
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
    fontFamily: 'Ubuntu',
    h1: {
      fontFamily: 'Rubik Doodle Shadow',
    },
    h2: {
      fontFamily: 'Rubik Doodle Shadow',
      color: '#094067'
    },
    h3: {
      fontFamily: 'Ubuntu',
      fontWeight: 500,
    },
    h4: {
      fontFamily: 'Ubuntu',
      fontWeight: 500
    }
  },
});

function App() {
  const token = useSelector(state => state.users.token);
  const dispatch = useDispatch();

  useEffect(()=>{
    /* Tries to fetch token on refresh to keep the user logged in */
    if (!token) dispatch(getToken())
  }, [])

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        {/* App has only two pages; if the user is authorized, login redirects to library, and if not, library redirects to login */}
        <Routes>
          <Route path='/' element={ <Navigate to="/login" /> } />
          <Route path='/login' element={<LoginRegister page={'Login'}/>} />
          <Route path='/register' element={<LoginRegister page={'Register'}/>} />
          <Route path='/library' element={<Auth><Library type={'tv'} search={false}/></Auth>} />
          <Route path='/library/tv' element={<Auth><Library type={'tv'} search={false} /></Auth>} />
          <Route path='/library/movies' element={<Auth><Library type={'movies'} search={false}/></Auth>} />
          <Route path='/library/books' element={<Auth><Library type={'books'} search={false}/></Auth>} />
          <Route path='/library/tv/search' element={<Auth><Library type={'tv'} search={true}/></Auth>} />
          <Route path='/library/movies/search' element={<Auth><Library type={'movies'} search={true}/></Auth>} />
          <Route path='/library/books/search' element={<Auth><Library type={'books'} search={true}/></Auth>} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;

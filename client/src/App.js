import { Routes, Route } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { getToken } from "./features/users/usersSlice";
import Nav from './components/Nav';
import LoginRegister from './components/LoginRegister';
import Logout from './components/Logout';
import Search from './components/Search';
import Auth from './auth/Auth';
import './App.css';
import Library from './components/Library';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const BASE_URL = process.env.REACT_APP_BASE_URL;

function App() {
  const [token, setToken] = useState();
  const [user, setUser] = useState();
  const dispatch = useDispatch();

  useEffect(()=>{
    if (!token) getToken();
  }, [])

  const getToken = async() => {
      try {
          const response = await axios.get(`${BASE_URL}/users/token`, {
              withCredentials: true
          })
          if (response.status === 200) {
            setToken(response.data.token);
            if (response.data.token) {
              const decode = jwtDecode(response.data.token);
              setUser(decode.user);
            }
          };
      } catch (error) {
          console.log(error);
      }
  }

  return (
    <AuthContext.Provider value={{token, setToken, user, setUser}}>
      <div className="App">
        <Routes>
          <Route path='/' element={token ? <Auth><Library/></Auth> : <LoginRegister page={'Login'}/>} />
          <Route path='/login' element={<LoginRegister page={'Login'}/>} />
          <Route path='/register' element={<LoginRegister page={'Register'}/>} />
          <Route path='/library' element={<Auth><Library/></Auth>} />
          <Route path='/search' element={<Auth><Search /></Auth>} />
          <Route path='/logout' element={<Logout />} />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

export default App;

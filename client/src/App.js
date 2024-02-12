import { Routes, Route } from 'react-router-dom';
import { useEffect, useState, createContext } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { getToken } from "./features/users/usersSlice";
import LoginRegister from './components/LoginRegister';
import Logout from './components/Logout';
import Auth from './auth/Auth';
import './App.css';
import Library from './components/Library';

function App() {
  const token = useSelector(state => state.users.token);
  const dispatch = useDispatch();

  useEffect(()=>{
    if (!token) dispatch(getToken());
  }, [])

  return (
    <div className="App">
        <Routes>
          <Route path='/' element={token ? <Auth><Library/></Auth> : <LoginRegister page={'Login'}/>} />
          <Route path='/login' element={<LoginRegister page={'Login'}/>} />
          <Route path='/register' element={<LoginRegister page={'Register'}/>} />
          <Route path='/library' element={<Auth><Library/></Auth>} />
          <Route path='/logout' element={<Logout />} />
        </Routes>
    </div>
  );
}

export default App;

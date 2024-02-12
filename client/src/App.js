import { Routes, Route } from 'react-router-dom';
import { useEffect, createContext } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { getToken } from "./features/users/usersSlice";
import Nav from './components/Nav';
import LoginRegister from './components/LoginRegister';
import Profile from './components/Profile';
import Logout from './components/Logout';
import Search from './components/Search';
import Auth from './auth/Auth';
import './App.css';
import Library from './components/Library';

export const AuthContext = createContext();

function App() {
  const token = useSelector(state => state.users.token);
  const dispatch = useDispatch();

  useEffect(()=>{
    if (!token) dispatch(getToken());
  }, [])

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<LoginRegister page={'Login'}/>} />
        <Route path='/login' element={<LoginRegister page={'Login'}/>} />
        <Route path='/register' element={<LoginRegister page={'Register'}/>} />
        <Route path='/library' element={<Auth><Library/></Auth>} />
        <Route path='/logout' element={<Logout />} />
      </Routes>
    </div>
  );
}

export default App;

import { Routes, Route } from 'react-router-dom';
import { useState, createContext } from 'react';
import Nav from './components/Nav';
import LoginRegister from './components/LoginRegister';
import Profile from './components/Profile';
import Logout from './components/Logout';
import Auth from './auth/Auth';
import './App.css';

export const AuthContext = createContext();

function App() {
  const [token, setToken] = useState();

  return (
    <AuthContext.Provider value={{token, setToken}}>
      <div className="App">
        <header className="App-header">
          <Nav />
        </header>
        <Routes>
          <Route path='/login' element={<LoginRegister page={'Login'}/>} />
          <Route path='/register' element={<LoginRegister page={'Register'}/>} />
          <Route path='/profile' element={<Auth><Profile/></Auth>} />
          <Route path='/logout' element={<Logout/>} />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

export default App;

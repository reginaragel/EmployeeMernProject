import logo from './logo.svg';
import './App.css';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import {Routes,Route} from 'react-router-dom';
import { UserContextProvider } from './components/UserContext';
import { useState } from 'react';
import MainPage from './components/MainPage';

function App() {

  const [token,setToken]=useState(null);
  return (
    <UserContextProvider value={{token,setToken}}>
      <Routes>
        <Route path='/' element={<MainPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
      </Routes>

    </UserContextProvider>
    
  );
}

export default App;

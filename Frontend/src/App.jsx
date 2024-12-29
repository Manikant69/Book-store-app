import React from 'react';
import Home from './home/Home';
import Courses from './courses/Courses';
import {Route, Routes, useNavigate } from 'react-router-dom';
import Signup from './components/Signup';
import Contacts from './contact/Contacts'

import {Toaster} from 'react-hot-toast';
import { useAuth } from './context/AuthProvider';


function App() {
  const [authUser, setAuthUser] = useAuth();
  const navigate = useNavigate();

  return (
    <div className='bg-white text-black dark:bg-slate-900 dark:text-white'>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/course' element={authUser ? <Courses/> : navigate('/signup')} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/contact' element={<Contacts/>}/>
    </Routes>
    <Toaster/>
    </div>
  )
}

export default App;

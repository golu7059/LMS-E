import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import AboutUs from './Pages/AboutUs';
import NotFound from './Pages/NotFound';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import CourseList from './Pages/Course/CourseList';


function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/courses' element={<CourseList/>} />

        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />

        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </>
  );
}

export default App;

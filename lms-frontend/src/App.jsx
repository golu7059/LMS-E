import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import AboutUs from './Pages/AboutUs';
import NotFound from './Pages/NotFound';
import Signup from './Pages/Signup';
import Login from './Pages/Login';


function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />

        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </>
  );
}

export default App;
